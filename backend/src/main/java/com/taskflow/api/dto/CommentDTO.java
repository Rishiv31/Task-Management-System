package com.taskflow.api.dto;

import com.taskflow.api.model.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private Long taskId;
    private UserSummaryDTO author;
    private String content;
    private LocalDateTime createdAt;

    public static CommentDTO fromEntity(Comment comment) {
        if (comment == null) return null;
        return CommentDTO.builder()
                .id(comment.getId())
                .taskId(comment.getTask().getId())
                .author(UserSummaryDTO.fromEntity(comment.getAuthor()))
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
