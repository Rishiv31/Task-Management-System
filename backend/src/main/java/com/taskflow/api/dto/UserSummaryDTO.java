package com.taskflow.api.dto;

import com.taskflow.api.model.User;
import com.taskflow.api.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String username;
    private String email;
    private String avatarUrl;
    private UserRole role;

    public static UserSummaryDTO fromEntity(User user) {
        if (user == null) return null;
        return UserSummaryDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .build();
    }
}
