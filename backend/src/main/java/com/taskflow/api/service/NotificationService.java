package com.taskflow.api.service;

import com.taskflow.api.dto.NotificationDTO;
import com.taskflow.api.model.Notification;
import com.taskflow.api.model.NotificationType;
import com.taskflow.api.model.Task;
import com.taskflow.api.model.User;
import com.taskflow.api.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<NotificationDTO> getUnreadNotificationsForUser(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public NotificationDTO createAndSendNotification(User receiver, User sender, Task task, String title, String content, NotificationType type) {
        Notification notification = Notification.builder()
                .user(receiver)
                .sender(sender)
                .task(task)
                .title(title)
                .content(content)
                .notificationType(type)
                .isRead(false)
                .build();

        Notification saved = notificationRepository.save(notification);
        NotificationDTO dto = NotificationDTO.fromEntity(saved);


        return dto;
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        notificationRepository.findById(notificationId).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }

    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }
}
