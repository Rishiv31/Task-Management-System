package com.taskflow.api.service;

import com.taskflow.api.dto.TaskDTO;
import com.taskflow.api.dto.UserSummaryDTO;
import com.taskflow.api.exception.BadRequestException;
import com.taskflow.api.exception.ResourceNotFoundException;
import com.taskflow.api.model.*;
import com.taskflow.api.repository.TaskRepository;
import com.taskflow.api.repository.UserRepository;
import com.taskflow.api.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkspaceService workspaceService;

    @Autowired
    private NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<TaskDTO> getRootTasksForWorkspace(Long workspaceId) {
        return taskRepository.findByWorkspaceIdAndParentIdIsNullOrderByBoardPositionAsc(workspaceId)
                .stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> getSubtasks(Long parentId) {
        return taskRepository.findByParentIdOrderByBoardPositionAsc(parentId)
                .stream()
                .map(TaskDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return TaskDTO.fromEntity(task);
    }

    @Transactional
    public TaskDTO createTask(TaskDTO dto, User creator) {
        Workspace workspace = workspaceRepository.findById(dto.getWorkspaceId())
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        User assignee = null;
        if (dto.getAssignee() != null && dto.getAssignee().getId() != null) {
            assignee = userRepository.findById(dto.getAssignee().getId()).orElse(null);
        }

        Task parent = null;
        if (dto.getParentId() != null) {
            parent = taskRepository.findById(dto.getParentId()).orElse(null);
        }

        // Generate auto board position if first task
        double boardPos = dto.getBoardPosition() != null ? dto.getBoardPosition() : 1000.0;
        if (dto.getBoardPosition() == null) {
            List<Task> existing = taskRepository.findByWorkspaceIdAndParentIdIsNullOrderByBoardPositionAsc(workspace.getId());
            if (!existing.isEmpty()) {
                boardPos = existing.get(existing.size() - 1).getBoardPosition() + 1000.0;
            }
        }

        Task task = Task.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .status(dto.getStatus() != null ? dto.getStatus() : TaskStatus.TODO)
                .priority(dto.getPriority() != null ? dto.getPriority() : TaskPriority.MEDIUM)
                .dueDate(dto.getDueDate())
                .points(dto.getPoints() != null ? dto.getPoints() : 1)
                .boardPosition(boardPos)
                .workspace(workspace)
                .creator(creator)
                .assignee(assignee)
                .parent(parent)
                .build();

        Task saved = taskRepository.save(task);
        TaskDTO savedDto = TaskDTO.fromEntity(saved);

        // Audit log
        workspaceService.logActivity(creator, workspace, "CREATE_TASK", "TASK", saved.getId(),
                creator.getUsername() + " created task: " + saved.getTitle());

        // Notify Assignee
        if (assignee != null && !assignee.getId().equals(creator.getId())) {
            notificationService.createAndSendNotification(
                    assignee,
                    creator,
                    saved,
                    "Task Assigned",
                    creator.getUsername() + " assigned you to the task: " + saved.getTitle(),
                    NotificationType.TASK_ASSIGNED
            );
        }

        return savedDto;
    }

    @Transactional
    public TaskDTO updateTask(Long id, TaskDTO dto, User modifier) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User oldAssignee = task.getAssignee();

        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        task.setDueDate(dto.getDueDate());
        task.setPoints(dto.getPoints());

        if (dto.getBoardPosition() != null) {
            task.setBoardPosition(dto.getBoardPosition());
        }

        User newAssignee = null;
        if (dto.getAssignee() != null && dto.getAssignee().getId() != null) {
            newAssignee = userRepository.findById(dto.getAssignee().getId()).orElse(null);
        }
        task.setAssignee(newAssignee);

        Task saved = taskRepository.save(task);
        TaskDTO savedDto = TaskDTO.fromEntity(saved);

        // Audit log
        workspaceService.logActivity(modifier, task.getWorkspace(), "UPDATE_TASK", "TASK", saved.getId(),
                modifier.getUsername() + " updated task details: " + saved.getTitle());

        // Assignee changed alert
        if (newAssignee != null && (oldAssignee == null || !oldAssignee.getId().equals(newAssignee.getId()))) {
            if (!newAssignee.getId().equals(modifier.getId())) {
                notificationService.createAndSendNotification(
                        newAssignee,
                        modifier,
                        saved,
                        "Task Assigned",
                        modifier.getUsername() + " assigned you to: " + saved.getTitle(),
                        NotificationType.TASK_ASSIGNED
                );
            }
        }

        return savedDto;
    }

    @Transactional
    public TaskDTO moveTask(Long id, TaskStatus status, Double boardPosition, User modifier) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        TaskStatus oldStatus = task.getStatus();
        task.setStatus(status);
        task.setBoardPosition(boardPosition);

        Task saved = taskRepository.save(task);
        TaskDTO savedDto = TaskDTO.fromEntity(saved);

        // Audit log for state transitions
        if (oldStatus != status) {
            workspaceService.logActivity(modifier, task.getWorkspace(), "MOVE_TASK", "TASK", saved.getId(),
                    modifier.getUsername() + " moved task to " + status);

            // If task is completed and someone else created it, notify creator
            if (status == TaskStatus.DONE && task.getCreator() != null && !task.getCreator().getId().equals(modifier.getId())) {
                notificationService.createAndSendNotification(
                        task.getCreator(),
                        modifier,
                        saved,
                        "Task Completed",
                        modifier.getUsername() + " completed: " + saved.getTitle(),
                        NotificationType.TASK_UPDATED
                );
            }
        }

        return savedDto;
    }

    @Transactional
    public void deleteTask(Long id, User modifier) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        Long workspaceId = task.getWorkspace().getId();

        // Audit log
        workspaceService.logActivity(modifier, task.getWorkspace(), "DELETE_TASK", "TASK", id,
                modifier.getUsername() + " deleted task: " + task.getTitle());

        taskRepository.delete(task);

    }

}
