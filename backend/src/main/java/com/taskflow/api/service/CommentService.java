package com.taskflow.api.service;

import com.taskflow.api.dto.CommentDTO;
import com.taskflow.api.exception.ResourceNotFoundException;
import com.taskflow.api.model.*;
import com.taskflow.api.repository.CommentRepository;
import com.taskflow.api.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private WorkspaceService workspaceService;

    @Autowired
    private NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsForTask(Long taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId)
                .stream()
                .map(CommentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentDTO addComment(Long taskId, String content, User author) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + taskId));

        Comment comment = Comment.builder()
                .task(task)
                .author(author)
                .content(content)
                .build();

        Comment saved = commentRepository.save(comment);
        CommentDTO dto = CommentDTO.fromEntity(saved);

        // Audit log
        workspaceService.logActivity(author, task.getWorkspace(), "ADD_COMMENT", "TASK", task.getId(),
                author.getUsername() + " commented on task: " + task.getTitle());

        // Notify Assignee
        if (task.getAssignee() != null && !task.getAssignee().getId().equals(author.getId())) {
            notificationService.createAndSendNotification(
                    task.getAssignee(),
                    author,
                    task,
                    "New Comment",
                    author.getUsername() + " commented on your assigned task: " + task.getTitle(),
                    NotificationType.MENTION
            );
        }

        // Notify Creator (if different from assignee and author)
        if (task.getCreator() != null && 
            !task.getCreator().getId().equals(author.getId()) && 
            (task.getAssignee() == null || !task.getCreator().getId().equals(task.getAssignee().getId()))) {
            notificationService.createAndSendNotification(
                    task.getCreator(),
                    author,
                    task,
                    "New Comment",
                    author.getUsername() + " commented on your task: " + task.getTitle(),
                    NotificationType.MENTION
            );
        }

        return dto;
    }
}
