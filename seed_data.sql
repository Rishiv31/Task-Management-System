USE taskflow_db;

-- Clear tables first to avoid duplicates
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE activity_logs;
TRUNCATE TABLE notifications;
TRUNCATE TABLE attachments;
TRUNCATE TABLE comments;
TRUNCATE TABLE tasks;
TRUNCATE TABLE workspace_members;
TRUNCATE TABLE workspaces;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Users (BCrypt hash for 'password123')
INSERT INTO users (id, username, email, password_hash, avatar_url, role) VALUES
(1, 'sarah_connor', 'sarah@taskflow.ai', '$2a$10$8.UnVuG9HHgffUDAlk8qCOuyzKyR6JUXK8tZPxQ929J.D6X.e3Csq', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'ADMIN'),
(2, 'alex_mercer', 'alex@taskflow.ai', '$2a$10$8.UnVuG9HHgffUDAlk8qCOuyzKyR6JUXK8tZPxQ929J.D6X.e3Csq', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'MEMBER'),
(3, 'elena_rodriguez', 'elena@taskflow.ai', '$2a$10$8.UnVuG9HHgffUDAlk8qCOuyzKyR6JUXK8tZPxQ929J.D6X.e3Csq', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'MEMBER'),
(4, 'marcus_vance', 'marcus@taskflow.ai', '$2a$10$8.UnVuG9HHgffUDAlk8qCOuyzKyR6JUXK8tZPxQ929J.D6X.e3Csq', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'MEMBER'),
(5, 'david_kim', 'david@taskflow.ai', '$2a$10$8.UnVuG9HHgffUDAlk8qCOuyzKyR6JUXK8tZPxQ929J.D6X.e3Csq', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'MEMBER');

-- 2. Insert Workspaces
INSERT INTO workspaces (id, name, slug, description, owner_id) VALUES
(1, 'Acme Platform Engineering', 'acme-platform-eng', 'Core infrastructure, CI/CD pipelines, and microservices scaling dashboard.', 1),
(2, 'SaaS Launch Marketing', 'saas-launch-mktg', 'Campaign tracking, SEO strategy, and Framer landing page conversion analytics.', 3),
(3, 'AI R&D Lab', 'ai-rd-lab', 'Deep learning fine-tuning pipelines, LLM agent integration, and task recommendation models.', 1);

-- 3. Insert Workspace Memberships
INSERT INTO workspace_members (workspace_id, user_id, member_role) VALUES
(1, 1, 'OWNER'),
(1, 2, 'ADMIN'),
(1, 3, 'MEMBER'),
(1, 5, 'MEMBER'),

(2, 3, 'OWNER'),
(2, 1, 'MEMBER'),
(2, 4, 'MEMBER'),

(3, 1, 'OWNER'),
(3, 2, 'MEMBER'),
(3, 5, 'MEMBER');

-- 4. Insert Tasks
-- Workspace 1: Acme Platform Eng
INSERT INTO tasks (id, title, description, status, priority, due_date, points, board_position, workspace_id, creator_id, assignee_id, parent_id) VALUES
(1, 'Migrate Core Services to Spring Boot 3.3', 'Upgrade all dependency layers to Spring Boot 3.3.x to utilize new virtual threads features. Need to verify security filter chain configurations and JWT parsing.', 'IN_PROGRESS', 'URGENT', '2026-06-15', 5, 1000.0, 1, 1, 2, NULL),
(2, 'Configure Redis Distributed Caching for API Endpoints', 'Implement caching layers on core task fetching and user authentication lookups to reduce MySQL read loads under high concurrent usage.', 'TODO', 'HIGH', '2026-06-20', 3, 2000.0, 1, 1, 5, NULL),
(3, 'Setup GitHub Actions CI/CD Pipeline', 'Define containerized workflows for building Spring Boot Docker image and compiling React SPA with Vite. Auto-deploy to AWS ECS on merge.', 'DONE', 'HIGH', '2026-05-18', 3, 1000.0, 1, 2, 2, NULL),
(4, 'Investigate Memory Leak on WebSocket Connections', 'Memory usage climbs slowly on production socket nodes. Suspect unreleased sessions or STOMP client state buffers. Profile heap dump.', 'BACKLOG', 'MEDIUM', '2026-06-30', 8, 1000.0, 1, 2, 1, NULL),
(5, 'Write Unit and Integration Tests for Auth Flow', 'Achieve 80%+ test coverage across SecurityConfig, TokenService, and UserController classes.', 'IN_REVIEW', 'LOW', '2026-06-10', 2, 1000.0, 1, 3, 3, NULL),

-- Workspace 3: AI R&D Lab
(6, 'Fine-Tune Llama 3 on Task Metadata', 'Create custom training JSON containing task titles, descriptions, status changes, and velocity values to teach the model how to make prioritization suggestions.', 'IN_PROGRESS', 'URGENT', '2026-06-05', 8, 1000.0, 3, 1, 5, NULL),
(7, 'Implement AI Deadline Predictor Pipeline', 'Develop an endpoint in the Spring Boot backend utilizing historical task logs to calculate probability coefficients of a user missing their target dates.', 'TODO', 'HIGH', '2026-06-12', 5, 1000.0, 3, 1, 2, NULL),
(8, 'Verify Token Limit Optimizations for RAG Agent', 'Minimize system prompt context templates to speed up processing cycles and reduce LLM cost overheads. Cache vector search indexes.', 'DONE', 'MEDIUM', '2026-05-20', 2, 1000.0, 3, 5, 1, NULL);

-- Subtasks (Parent_id associations)
INSERT INTO tasks (id, title, description, status, priority, due_date, points, board_position, workspace_id, creator_id, assignee_id, parent_id) VALUES
(9, 'Update pom.xml dependencies & check compatibility', 'Subtask for Spring Boot migration.', 'DONE', 'HIGH', '2026-05-25', 1, 100.0, 1, 1, 2, 1),
(10, 'Resolve deprecated WebSecurityConfigurerAdapter methods', 'Fix compilation warnings in SecurityConfig class.', 'IN_PROGRESS', 'HIGH', '2026-06-01', 2, 200.0, 1, 1, 2, 1);

-- 5. Insert Comments
INSERT INTO comments (id, task_id, author_id, content) VALUES
(1, 1, 1, 'Make sure to run Maven builds with JDK 23 settings in pom.xml. I set it up last night!'),
(2, 1, 2, 'Got it, Sarah. Checking dependencies now. Upgraded spring-security-web and JWT packages successfully.'),
(3, 3, 1, 'Beautiful setup. Pipeline executes in under 2 minutes now!'),
(4, 6, 5, 'Dataset contains 10,000 synthetic task logs. Fine-tuning completed epoch 3. Training loss is down to 0.42!'),
(5, 6, 1, 'Outstanding progress David! Let''s hook up the autocomplete endpoint next.');

-- 6. Insert Attachments
INSERT INTO attachments (id, task_id, file_name, file_url, file_size, uploaded_by_id) VALUES
(1, 1, 'migration_blueprint.pdf', 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', 124500, 1),
(2, 6, 'llama3_weights_summary.png', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400', 842000, 5);

-- 7. Insert Notifications
INSERT INTO notifications (id, user_id, sender_id, task_id, title, content, notification_type, is_read) VALUES
(1, 2, 1, 1, 'Task Assigned: Spring Boot Upgrade', 'Sarah Connor assigned you to the task: Migrate Core Services to Spring Boot 3.3.', 'TASK_ASSIGNED', FALSE),
(2, 1, 2, 3, 'Task Done: CI/CD Pipeline', 'Alex Mercer completed: Setup GitHub Actions CI/CD Pipeline.', 'TASK_UPDATED', FALSE),
(3, 1, 5, 6, 'New Comment on AI Fine-Tuning', 'David Kim left a comment: Dataset contains 10,000 synthetic task logs...', 'MENTION', FALSE),
(4, 3, 1, 5, 'Review Requested: Unit Tests', 'Sarah Connor requested a review on: Write Unit and Integration Tests for Auth Flow.', 'SYSTEM', FALSE);

-- 8. Insert Activity Logs
INSERT INTO activity_logs (id, user_id, workspace_id, action, entity_type, entity_id, details) VALUES
(1, 1, 1, 'CREATE_WORKSPACE', 'WORKSPACE', 1, 'Sarah Connor created workspace Acme Platform Engineering'),
(2, 1, 1, 'CREATE_TASK', 'TASK', 1, 'Sarah Connor created task: Migrate Core Services to Spring Boot 3.3'),
(3, 1, 1, 'ASSIGN_TASK', 'TASK', 1, 'Sarah Connor assigned task to Alex Mercer'),
(4, 2, 1, 'START_TASK', 'TASK', 1, 'Alex Mercer moved task to IN_PROGRESS'),
(5, 2, 1, 'COMPLETE_TASK', 'TASK', 3, 'Alex Mercer moved Setup GitHub Actions CI/CD Pipeline to DONE'),
(6, 5, 3, 'ADD_COMMENT', 'COMMENT', 4, 'David Kim added a comment on Fine-Tune Llama 3 on Task Metadata');
