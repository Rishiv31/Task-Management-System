package com.taskflow.api.repository;

import com.taskflow.api.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
    List<ActivityLog> findByWorkspaceIdOrderByCreatedAtDesc(Long workspaceId);
}
