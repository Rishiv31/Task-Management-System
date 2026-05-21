package com.taskflow.api.service;

import com.taskflow.api.dto.ActivityLogDTO;
import com.taskflow.api.dto.WorkspaceDTO;
import com.taskflow.api.dto.WorkspaceMemberDTO;
import com.taskflow.api.exception.BadRequestException;
import com.taskflow.api.exception.ResourceNotFoundException;
import com.taskflow.api.model.*;
import com.taskflow.api.repository.ActivityLogRepository;
import com.taskflow.api.repository.UserRepository;
import com.taskflow.api.repository.WorkspaceMemberRepository;
import com.taskflow.api.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkspaceService {

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<WorkspaceDTO> getWorkspacesForUser(Long userId) {
        List<Workspace> workspaces = workspaceMemberRepository.findWorkspacesByUserId(userId);
        return workspaces.stream().map(WorkspaceDTO::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WorkspaceDTO getWorkspaceById(Long id) {
        Workspace w = workspaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + id));
        return WorkspaceDTO.fromEntity(w);
    }

    @Transactional(readOnly = true)
    public WorkspaceDTO getWorkspaceBySlug(String slug) {
        Workspace w = workspaceRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with slug: " + slug));
        return WorkspaceDTO.fromEntity(w);
    }

    @Transactional
    public WorkspaceDTO createWorkspace(WorkspaceDTO dto, User owner) {
        String slug = dto.getName().toLowerCase().replaceAll("[^a-z0-9]", "-");
        if (workspaceRepository.findBySlug(slug).isPresent()) {
            slug += "-" + System.currentTimeMillis() % 1000;
        }

        Workspace w = Workspace.builder()
                .name(dto.getName())
                .slug(slug)
                .description(dto.getDescription())
                .owner(owner)
                .build();

        Workspace saved = workspaceRepository.save(w);

        // Add creator as OWNER of this workspace
        WorkspaceMemberId memberId = new WorkspaceMemberId(saved.getId(), owner.getId());
        WorkspaceMember member = WorkspaceMember.builder()
                .id(memberId)
                .workspace(saved)
                .user(owner)
                .memberRole(WorkspaceRole.OWNER)
                .build();
        workspaceMemberRepository.save(member);

        // Log action
        logActivity(owner, saved, "CREATE_WORKSPACE", "WORKSPACE", saved.getId(),
                owner.getUsername() + " created workspace: " + saved.getName());

        return WorkspaceDTO.fromEntity(saved);
    }

    @Transactional
    public WorkspaceMemberDTO inviteMember(Long workspaceId, String usernameOrEmail, WorkspaceRole role, User inviter) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        User targetUser = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found with identifier: " + usernameOrEmail)));

        WorkspaceMemberId id = new WorkspaceMemberId(workspaceId, targetUser.getId());
        if (workspaceMemberRepository.existsById(id)) {
            throw new BadRequestException("User is already a member of this workspace");
        }

        WorkspaceMember member = WorkspaceMember.builder()
                .id(id)
                .workspace(workspace)
                .user(targetUser)
                .memberRole(role)
                .build();

        WorkspaceMember saved = workspaceMemberRepository.save(member);

        // Log action
        logActivity(inviter, workspace, "INVITE_MEMBER", "USER", targetUser.getId(),
                inviter.getUsername() + " invited " + targetUser.getUsername() + " to workspace");

        // Send system notification to user
        notificationService.createAndSendNotification(
                targetUser,
                inviter,
                null,
                "Workspace Invitation",
                inviter.getUsername() + " added you to the workspace: " + workspace.getName(),
                NotificationType.SYSTEM
        );

        return WorkspaceMemberDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<WorkspaceMemberDTO> getWorkspaceMembers(Long workspaceId) {
        return workspaceMemberRepository.findByWorkspaceId(workspaceId)
                .stream()
                .map(WorkspaceMemberDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ActivityLogDTO> getWorkspaceActivities(Long workspaceId) {
        return activityLogRepository.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId)
                .stream()
                .map(ActivityLogDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void logActivity(User user, Workspace workspace, String action, String entityType, Long entityId, String details) {
        ActivityLog log = ActivityLog.builder()
                .user(user)
                .workspace(workspace)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build();
        activityLogRepository.save(log);
    }
}
