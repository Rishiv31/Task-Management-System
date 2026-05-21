package com.taskflow.api.controller;

import com.taskflow.api.dto.ActivityLogDTO;
import com.taskflow.api.dto.WorkspaceDTO;
import com.taskflow.api.dto.WorkspaceMemberDTO;
import com.taskflow.api.model.WorkspaceRole;
import com.taskflow.api.security.CustomUserDetails;
import com.taskflow.api.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/workspaces")
@CrossOrigin(origins = "*")
public class WorkspaceController {

    @Autowired
    private WorkspaceService workspaceService;

    @GetMapping
    public ResponseEntity<List<WorkspaceDTO>> getWorkspaces(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(workspaceService.getWorkspacesForUser(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkspaceDTO> getWorkspaceById(@PathVariable Long id) {
        return ResponseEntity.ok(workspaceService.getWorkspaceById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<WorkspaceDTO> getWorkspaceBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(workspaceService.getWorkspaceBySlug(slug));
    }

    @PostMapping
    public ResponseEntity<WorkspaceDTO> createWorkspace(
            @RequestBody WorkspaceDTO dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(workspaceService.createWorkspace(dto, userDetails.getUser()));
    }

    @PostMapping("/{id}/invite")
    public ResponseEntity<WorkspaceMemberDTO> inviteMember(
            @PathVariable Long id,
            @RequestBody Map<String, String> requestBody,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String identifier = requestBody.get("usernameOrEmail");
        String roleStr = requestBody.getOrDefault("role", "MEMBER");
        WorkspaceRole role = WorkspaceRole.valueOf(roleStr.toUpperCase());

        return ResponseEntity.ok(workspaceService.inviteMember(id, identifier, role, userDetails.getUser()));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<WorkspaceMemberDTO>> getWorkspaceMembers(@PathVariable Long id) {
        return ResponseEntity.ok(workspaceService.getWorkspaceMembers(id));
    }

    @GetMapping("/{id}/activities")
    public ResponseEntity<List<ActivityLogDTO>> getWorkspaceActivities(@PathVariable Long id) {
        return ResponseEntity.ok(workspaceService.getWorkspaceActivities(id));
    }
}
