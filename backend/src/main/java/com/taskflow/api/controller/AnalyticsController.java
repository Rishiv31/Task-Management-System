package com.taskflow.api.controller;

import com.taskflow.api.security.CustomUserDetails;
import com.taskflow.api.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getProductivityInsights(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(analyticsService.getUserProductivityInsights(userDetails.getId()));
    }
}
