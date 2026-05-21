package com.taskflow.api.dto;

import com.taskflow.api.model.Workspace;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private UserSummaryDTO owner;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static WorkspaceDTO fromEntity(Workspace workspace) {
        if (workspace == null) return null;
        return WorkspaceDTO.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .slug(workspace.getSlug())
                .description(workspace.getDescription())
                .owner(UserSummaryDTO.fromEntity(workspace.getOwner()))
                .createdAt(workspace.getCreatedAt())
                .updatedAt(workspace.getUpdatedAt())
                .build();
    }
}
