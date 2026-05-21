package com.taskflow.api.controller;

import com.taskflow.api.dto.CommentDTO;
import com.taskflow.api.security.CustomUserDetails;
import com.taskflow.api.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable Long taskId) {
        return ResponseEntity.ok(commentService.getCommentsForTask(taskId));
    }

    @PostMapping("/task/{taskId}")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable Long taskId,
            @RequestBody Map<String, String> requestBody,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String content = requestBody.get("content");
        return ResponseEntity.ok(commentService.addComment(taskId, content, userDetails.getUser()));
    }
}
