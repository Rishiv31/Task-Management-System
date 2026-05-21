package com.taskflow.api.dto;

import com.taskflow.api.model.Notification;
import com.taskflow.api.model.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    private Long id;
    private Long userId;
    private UserSummaryDTO sender;
    private Long taskId;
    private String taskTitle;
    private String title;
    private String content;
    private NotificationType notificationType;
    private Boolean isRead;
    private LocalDateTime createdAt;

    public static NotificationDTO fromEntity(Notification notification) {
        if (notification == null) return null;
        return NotificationDTO.builder()
                .id(notification.getId())
                .userId(notification.getUser().getId())
                .sender(UserSummaryDTO.fromEntity(notification.getSender()))
                .taskId(notification.getTask() != null ? notification.getTask().getId() : null)
                .taskTitle(notification.getTask() != null ? notification.getTask().getTitle() : null)
                .title(notification.getTitle())
                .content(notification.getContent())
                .notificationType(notification.getNotificationType())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
