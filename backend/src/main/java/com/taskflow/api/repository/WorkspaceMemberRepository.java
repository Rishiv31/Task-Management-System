package com.taskflow.api.repository;

import com.taskflow.api.model.Workspace;
import com.taskflow.api.model.WorkspaceMember;
import com.taskflow.api.model.WorkspaceMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, WorkspaceMemberId> {
    List<WorkspaceMember> findByWorkspaceId(Long workspaceId);
    List<WorkspaceMember> findByUserId(Long userId);
    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    @Query("SELECT wm.workspace FROM WorkspaceMember wm WHERE wm.user.id = :userId")
    List<Workspace> findWorkspacesByUserId(@Param("userId") Long userId);
}
