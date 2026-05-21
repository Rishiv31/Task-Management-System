package com.taskflow.api.config;

import com.taskflow.api.model.*;
import com.taskflow.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private WorkspaceMemberRepository workspaceMemberRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database already seeded. Skipping programmatic data seeding.");
            return;
        }

        System.out.println("Starting Database Seeding for TaskFlow...");

        String defaultPasswordHash = passwordEncoder.encode("password123");

        // 1. Create Users
        User sarah = User.builder()
                .username("sarah_connor")
                .email("sarah@taskflow.ai")
                .passwordHash(defaultPasswordHash)
                .avatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150")
                .role(UserRole.ADMIN)
                .build();

        User alex = User.builder()
                .username("alex_mercer")
                .email("alex@taskflow.ai")
                .passwordHash(defaultPasswordHash)
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                .role(UserRole.MEMBER)
                .build();

        User elena = User.builder()
                .username("elena_rodriguez")
                .email("elena@taskflow.ai")
                .passwordHash(defaultPasswordHash)
                .avatarUrl("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150")
                .role(UserRole.MEMBER)
                .build();

        User marcus = User.builder()
                .username("marcus_vance")
                .email("marcus@taskflow.ai")
                .passwordHash(defaultPasswordHash)
                .avatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150")
                .role(UserRole.MEMBER)
                .build();

        User david = User.builder()
                .username("david_kim")
                .email("david@taskflow.ai")
                .passwordHash(defaultPasswordHash)
                .avatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150")
                .role(UserRole.MEMBER)
                .build();

        User alice = User.builder()
                .username("alice")
                .email("alice@taskflow.ai")
                .passwordHash(defaultPasswordHash)
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .role(UserRole.MEMBER)
                .build();

        sarah = userRepository.save(sarah);
        alex = userRepository.save(alex);
        elena = userRepository.save(elena);
        marcus = userRepository.save(marcus);
        david = userRepository.save(david);
        alice = userRepository.save(alice);

        // 2. Create Workspaces
        Workspace acme = Workspace.builder()
                .name("Acme Platform Engineering")
                .slug("acme-platform-eng")
                .description("Core infrastructure, CI/CD pipelines, and microservices scaling dashboard.")
                .owner(sarah)
                .build();

        Workspace saas = Workspace.builder()
                .name("SaaS Launch Marketing")
                .slug("saas-launch-mktg")
                .description("Campaign tracking, SEO strategy, and Framer landing page conversion analytics.")
                .owner(elena)
                .build();

        Workspace aiLab = Workspace.builder()
                .name("Data Platform Engineering")
                .slug("data-platform-eng")
                .description("Core data ingestion pipelines, SQL index optimizations, and query profiling dashboards.")
                .owner(sarah)
                .build();

        acme = workspaceRepository.save(acme);
        saas = workspaceRepository.save(saas);
        aiLab = workspaceRepository.save(aiLab);

        // 3. Add Workspace Members
        // Acme Platform Eng Members
        addMember(acme, sarah, WorkspaceRole.OWNER);
        addMember(acme, alex, WorkspaceRole.ADMIN);
        addMember(acme, elena, WorkspaceRole.MEMBER);
        addMember(acme, david, WorkspaceRole.MEMBER);
        addMember(acme, alice, WorkspaceRole.MEMBER);

        // SaaS Marketing Members
        addMember(saas, elena, WorkspaceRole.OWNER);
        addMember(saas, sarah, WorkspaceRole.MEMBER);
        addMember(saas, marcus, WorkspaceRole.MEMBER);
        addMember(saas, alice, WorkspaceRole.MEMBER);

        // Data Platform Eng Members
        addMember(aiLab, sarah, WorkspaceRole.OWNER);
        addMember(aiLab, alex, WorkspaceRole.MEMBER);
        addMember(aiLab, david, WorkspaceRole.MEMBER);
        addMember(aiLab, alice, WorkspaceRole.MEMBER);

        // 4. Create Tasks
        // Workspace 1: Acme Platform Eng Tasks
        Task task1 = Task.builder()
                .title("Migrate Core Services to Spring Boot 3.3")
                .description("Upgrade all dependency layers to Spring Boot 3.3.x to utilize new virtual threads features. Need to verify security filter chain configurations and JWT parsing.")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.URGENT)
                .dueDate(LocalDate.now().plusDays(15))
                .points(5)
                .boardPosition(1000.0)
                .workspace(acme)
                .creator(sarah)
                .assignee(alex)
                .build();

        Task task2 = Task.builder()
                .title("Configure Redis Distributed Caching for API Endpoints")
                .description("Implement caching layers on core task fetching and user authentication lookups to reduce MySQL read loads under high concurrent usage.")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .dueDate(LocalDate.now().plusDays(20))
                .points(3)
                .boardPosition(2000.0)
                .workspace(acme)
                .creator(sarah)
                .assignee(david)
                .build();

        Task task3 = Task.builder()
                .title("Setup GitHub Actions CI/CD Pipeline")
                .description("Define containerized workflows for building Spring Boot Docker image and compiling React SPA with Vite. Auto-deploy to AWS ECS on merge.")
                .status(TaskStatus.DONE)
                .priority(TaskPriority.HIGH)
                .dueDate(LocalDate.now().minusDays(3))
                .points(3)
                .boardPosition(1000.0)
                .workspace(acme)
                .creator(alex)
                .assignee(alex)
                .build();

        Task task4 = Task.builder()
                .title("Investigate Memory Leak on WebSocket Connections")
                .description("Memory usage climbs slowly on production socket nodes. Suspect unreleased sessions or STOMP client state buffers. Profile heap dump.")
                .status(TaskStatus.BACKLOG)
                .priority(TaskPriority.MEDIUM)
                .dueDate(LocalDate.now().plusDays(30))
                .points(8)
                .boardPosition(1000.0)
                .workspace(acme)
                .creator(alex)
                .assignee(sarah)
                .build();

        Task task5 = Task.builder()
                .title("Write Unit and Integration Tests for Auth Flow")
                .description("Achieve 80%+ test coverage across SecurityConfig, TokenService, and UserController classes.")
                .status(TaskStatus.IN_REVIEW)
                .priority(TaskPriority.LOW)
                .dueDate(LocalDate.now().plusDays(10))
                .points(2)
                .boardPosition(1000.0)
                .workspace(acme)
                .creator(elena)
                .assignee(elena)
                .build();

        task1 = taskRepository.save(task1);
        task2 = taskRepository.save(task2);
        task3 = taskRepository.save(task3);
        task4 = taskRepository.save(task4);
        task5 = taskRepository.save(task5);

        // Subtasks (Parent association)
        Task subtask1 = Task.builder()
                .title("Update pom.xml dependencies & check compatibility")
                .description("Subtask for Spring Boot migration.")
                .status(TaskStatus.DONE)
                .priority(TaskPriority.HIGH)
                .dueDate(LocalDate.now().plusDays(4))
                .points(1)
                .boardPosition(100.0)
                .workspace(acme)
                .creator(sarah)
                .assignee(alex)
                .parent(task1)
                .build();

        Task subtask2 = Task.builder()
                .title("Resolve deprecated WebSecurityConfigurerAdapter methods")
                .description("Fix compilation warnings in SecurityConfig class.")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.HIGH)
                .dueDate(LocalDate.now().plusDays(10))
                .points(2)
                .boardPosition(200.0)
                .workspace(acme)
                .creator(sarah)
                .assignee(alex)
                .parent(task1)
                .build();

        taskRepository.save(subtask1);
        taskRepository.save(subtask2);

        // Data Platform Tasks
        Task task6 = Task.builder()
                .title("Optimize Core Database Queries & Indexes")
                .description("Investigate and rewrite slow-running queries in task tracking and activity log modules. Add compound indexes on frequently queried combinations (workspace_id, status).")
                .status(TaskStatus.IN_PROGRESS)
                .priority(TaskPriority.URGENT)
                .dueDate(LocalDate.now().plusDays(5))
                .points(8)
                .boardPosition(1000.0)
                .workspace(aiLab)
                .creator(sarah)
                .assignee(david)
                .build();

        Task task7 = Task.builder()
                .title("Implement Core Data Archival Pipeline")
                .description("Develop a background scheduled archival runner in Spring Boot to move activity logs older than 90 days to offline cold storage, reducing active table sizes.")
                .status(TaskStatus.TODO)
                .priority(TaskPriority.HIGH)
                .dueDate(LocalDate.now().plusDays(12))
                .points(5)
                .boardPosition(1000.0)
                .workspace(aiLab)
                .creator(sarah)
                .assignee(alex)
                .build();

        Task task8 = Task.builder()
                .title("Verify Cache Expiry Policies for Session Store")
                .description("Validate eviction policies and TTL settings for distributed cache stores to prevent session memory leaks during spikes in WebSocket activity.")
                .status(TaskStatus.DONE)
                .priority(TaskPriority.MEDIUM)
                .dueDate(LocalDate.now().minusDays(1))
                .points(2)
                .boardPosition(1000.0)
                .workspace(aiLab)
                .creator(david)
                .assignee(sarah)
                .build();

        taskRepository.save(task6);
        taskRepository.save(task7);
        taskRepository.save(task8);

        // 5. Create Comments
        Comment comment1 = Comment.builder()
                .task(task1)
                .author(sarah)
                .content("Make sure to run Maven builds with JDK 23 settings in pom.xml. I set it up last night!")
                .build();

        Comment comment2 = Comment.builder()
                .task(task1)
                .author(alex)
                .content("Got it, Sarah. Checking dependencies now. Upgraded spring-security-web and JWT packages successfully.")
                .build();

        Comment comment3 = Comment.builder()
                .task(task3)
                .author(sarah)
                .content("Beautiful setup. Pipeline executes in under 2 minutes now!")
                .build();

        Comment comment4 = Comment.builder()
                .task(task6)
                .author(david)
                .content("Query tuning completed. Re-indexed task table. Query execution times dropped from 240ms down to 12ms under load!")
                .build();

        Comment comment5 = Comment.builder()
                .task(task6)
                .author(sarah)
                .content("Excellent result David! Let's monitor the index usage metrics over the next week.")
                .build();

        commentRepository.save(comment1);
        commentRepository.save(comment2);
        commentRepository.save(comment3);
        commentRepository.save(comment4);
        commentRepository.save(comment5);

        // 6. Create Notifications
        Notification notification1 = Notification.builder()
                .user(alex)
                .sender(sarah)
                .task(task1)
                .title("Task Assigned: Spring Boot Upgrade")
                .content("Sarah Connor assigned you to the task: Migrate Core Services to Spring Boot 3.3.")
                .notificationType(NotificationType.TASK_ASSIGNED)
                .isRead(false)
                .build();

        Notification notification2 = Notification.builder()
                .user(sarah)
                .sender(alex)
                .task(task3)
                .title("Task Done: CI/CD Pipeline")
                .content("Alex Mercer completed: Setup GitHub Actions CI/CD Pipeline.")
                .notificationType(NotificationType.TASK_UPDATED)
                .isRead(false)
                .build();

        Notification notification3 = Notification.builder()
                .user(sarah)
                .sender(david)
                .task(task6)
                .title("New Comment on Query Optimization")
                .content("David Kim left a comment: Query tuning completed. Re-indexed task table...")
                .notificationType(NotificationType.MENTION)
                .isRead(false)
                .build();

        Notification notification4 = Notification.builder()
                .user(elena)
                .sender(sarah)
                .task(task5)
                .title("Review Requested: Unit Tests")
                .content("Sarah Connor requested a review on: Write Unit and Integration Tests for Auth Flow.")
                .notificationType(NotificationType.SYSTEM)
                .isRead(false)
                .build();

        notificationRepository.save(notification1);
        notificationRepository.save(notification2);
        notificationRepository.save(notification3);
        notificationRepository.save(notification4);

        // 7. Create Activity Logs
        ActivityLog log1 = ActivityLog.builder()
                .user(sarah)
                .workspace(acme)
                .action("CREATE_WORKSPACE")
                .entityType("WORKSPACE")
                .entityId(acme.getId())
                .details("Sarah Connor created workspace Acme Platform Engineering")
                .build();

        ActivityLog log2 = ActivityLog.builder()
                .user(sarah)
                .workspace(acme)
                .action("CREATE_TASK")
                .entityType("TASK")
                .entityId(task1.getId())
                .details("Sarah Connor created task: Migrate Core Services to Spring Boot 3.3")
                .build();

        ActivityLog log3 = ActivityLog.builder()
                .user(sarah)
                .workspace(acme)
                .action("ASSIGN_TASK")
                .entityType("TASK")
                .entityId(task1.getId())
                .details("Sarah Connor assigned task to Alex Mercer")
                .build();

        ActivityLog log4 = ActivityLog.builder()
                .user(alex)
                .workspace(acme)
                .action("START_TASK")
                .entityType("TASK")
                .entityId(task1.getId())
                .details("Alex Mercer moved task to IN_PROGRESS")
                .build();

        ActivityLog log5 = ActivityLog.builder()
                .user(alex)
                .workspace(acme)
                .action("COMPLETE_TASK")
                .entityType("TASK")
                .entityId(task3.getId())
                .details("Alex Mercer moved Setup GitHub Actions CI/CD Pipeline to DONE")
                .build();

        ActivityLog log6 = ActivityLog.builder()
                .user(david)
                .workspace(aiLab)
                .action("ADD_COMMENT")
                .entityType("COMMENT")
                .entityId(comment4.getId())
                .details("David Kim added a comment on Optimize Core Database Queries & Indexes")
                .build();

        activityLogRepository.save(log1);
        activityLogRepository.save(log2);
        activityLogRepository.save(log3);
        activityLogRepository.save(log4);
        activityLogRepository.save(log5);
        activityLogRepository.save(log6);

        System.out.println("TaskFlow database successfully programmatically seeded!");
    }

    private void addMember(Workspace workspace, User user, WorkspaceRole role) {
        WorkspaceMemberId memberId = new WorkspaceMemberId(workspace.getId(), user.getId());
        WorkspaceMember member = WorkspaceMember.builder()
                .id(memberId)
                .workspace(workspace)
                .user(user)
                .memberRole(role)
                .build();
        workspaceMemberRepository.save(member);
    }
}
