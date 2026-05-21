package com.taskflow.api.dto;

import com.taskflow.api.model.ActivityLog;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDTO {
    private Long id;
    private UserSummaryDTO user;
    private Long workspaceId;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private LocalDateTime createdAt;

    public static ActivityLogDTO fromEntity(ActivityLog log) {
        if (log == null) return null;
        return ActivityLogDTO.builder()
                .id(log.getId())
                .user(UserSummaryDTO.fromEntity(log.getUser()))
                .workspaceId(log.getWorkspace().getId())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .details(log.getDetails())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
