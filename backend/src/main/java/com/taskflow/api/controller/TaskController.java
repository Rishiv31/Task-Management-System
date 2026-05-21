package com.taskflow.api.controller;

import com.taskflow.api.dto.TaskDTO;
import com.taskflow.api.model.TaskStatus;
import com.taskflow.api.security.CustomUserDetails;
import com.taskflow.api.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/workspace/{workspaceId}")
    public ResponseEntity<List<TaskDTO>> getRootTasks(@PathVariable Long workspaceId) {
        return ResponseEntity.ok(taskService.getRootTasksForWorkspace(workspaceId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(
            @RequestBody TaskDTO dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(taskService.createTask(dto, userDetails.getUser()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long id,
            @RequestBody TaskDTO dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(taskService.updateTask(id, dto, userDetails.getUser()));
    }

    @PatchMapping("/{id}/move")
    public ResponseEntity<TaskDTO> moveTask(
            @PathVariable Long id,
            @RequestBody Map<String, Object> requestBody,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String statusStr = (String) requestBody.get("status");
        TaskStatus status = TaskStatus.valueOf(statusStr.toUpperCase());
        Number posNum = (Number) requestBody.get("boardPosition");
        Double boardPosition = posNum != null ? posNum.doubleValue() : 0.0;

        return ResponseEntity.ok(taskService.moveTask(id, status, boardPosition, userDetails.getUser()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        taskService.deleteTask(id, userDetails.getUser());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/subtasks")
    public ResponseEntity<List<TaskDTO>> getSubtasks(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getSubtasks(id));
    }
}
