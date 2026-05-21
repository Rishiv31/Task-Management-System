package com.taskflow.api.dto;

import com.taskflow.api.model.Task;
import com.taskflow.api.model.TaskPriority;
import com.taskflow.api.model.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;
    private Integer points;
    private Double boardPosition;
    private Long workspaceId;
    private UserSummaryDTO creator;
    private UserSummaryDTO assignee;
    private Long parentId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskDTO fromEntity(Task task) {
        if (task == null) return null;
        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .dueDate(task.getDueDate())
                .points(task.getPoints())
                .boardPosition(task.getBoardPosition())
                .workspaceId(task.getWorkspace().getId())
                .creator(UserSummaryDTO.fromEntity(task.getCreator()))
                .assignee(UserSummaryDTO.fromEntity(task.getAssignee()))
                .parentId(task.getParent() != null ? task.getParent().getId() : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
