package com.taskflow.api.dto;

import com.taskflow.api.model.WorkspaceMember;
import com.taskflow.api.model.WorkspaceRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceMemberDTO {
    private Long userId;
    private String username;
    private String email;
    private String avatarUrl;
    private WorkspaceRole memberRole;
    private LocalDateTime joinedAt;

    public static WorkspaceMemberDTO fromEntity(WorkspaceMember member) {
        if (member == null) return null;
        return WorkspaceMemberDTO.builder()
                .userId(member.getUser().getId())
                .username(member.getUser().getUsername())
                .email(member.getUser().getEmail())
                .avatarUrl(member.getUser().getAvatarUrl())
                .memberRole(member.getMemberRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}
