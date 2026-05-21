package com.taskflow.api.repository;

import com.taskflow.api.model.Task;
import com.taskflow.api.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByWorkspaceId(Long workspaceId);
    List<Task> findByWorkspaceIdAndParentIdIsNullOrderByBoardPositionAsc(Long workspaceId);
    List<Task> findByAssigneeId(Long assigneeId);
    List<Task> findByWorkspaceIdAndAssigneeId(Long workspaceId, Long assigneeId);
    List<Task> findByWorkspaceIdAndStatusOrderByBoardPositionAsc(Long workspaceId, TaskStatus status);
    List<Task> findByParentIdOrderByBoardPositionAsc(Long parentId);
}
