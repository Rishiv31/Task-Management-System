# ⚡ TaskFlow AI — Intelligent Productivity Operating System

TaskFlow AI is an ultra-modern, full-stack, AI-powered Task Management SaaS platform with a premium, glassmorphic UI/UX inspired by Linear, Stripe, Vercel, and Framer. It features high-fidelity widgets, dynamic Recharts analytics, real-time STOMP WebSockets, native Kanban dragging, and an intelligent AI Copilot.

---

## 🚀 Key Features

### 🌟 Immersive Glassmorphism UI/UX
- Sleek dark theme (`#030303`) with dynamic radial gradients that follow active scopes.
- Frosted blurred glass cards (`.glass-card`) and premium floating transitions powered by Framer Motion.
- Collapse-responsive sidebar and custom scrollbars.
- Keyboard-navigable Raycast Command Menu (`Ctrl + K` / `Cmd + K`) for instant actions.
- Sound-chime alerts for high-priority user mentions.

### 🔄 Real-Time Resilient Dual-Sync Engine
- **Under 50ms Real-Time Push:** Instantly synchronizes task creations, moves (Kanban drag-and-drop), details editing, and commenting streams across all active collaborative browser instances.
- **Fail-Safe Polling Fallback:** Automatically switches to a 6-second REST polling fallback if STOMP socket gateways are offline or blocked, guaranteeing continuous data hydration.

### 🧠 Cognitive AI Copilot Integration
- **Granular Backlog Decomposer:** Instantly breaks down complex technical tasks (like "Migrate DB schema") into precise, structured checklists with complexity and priority weights.
- **Executive Health Analyst:** Generates one-click aggregate reports on sprint progress, workloads, review bottlenecks, and focus scores.
- **Predictive Deadline Risk Assessor:** Diagnoses task drift risk and calculates completion risk percentages based on priority, points, and remaining days.

---

## 🛠️ Tech Stack & Architecture

### Frontend (React + Vite)
- **Framework:** React 18
- **Styling:** Tailwind CSS + Framer Motion (for spring animations and sliding panels)
- **State Management:** Zustand (optimized store mapping for auth, tasks, workspaces, and notifications)
- **Data Fetching:** Axios with automatic JWT request/response interceptors (redirects on 401 expiration)
- **Data Visualization:** Recharts (custom styled gradient Area and Bar charts)

### Backend (Spring Boot 3.3)
- **Framework:** Spring Boot 3.3.0 & Java 23
- **Security:** Spring Security + Stateless JWT Authentication
- **Data Access:** Spring Data JPA + Hibernate (MySQL / H2 Dev fallback profile)
- **Real-Time Gateway:** Spring STOMP WebSocket Messaging Broker
- **API Specs:** Validated REST APIs, customized Global Exception Handling.

---

## 📂 Project Structure

```
TMS/
├── docker-compose.yml        # Pre-configured MySQL 8.0 local setup
├── schema.sql                # Table structures & indexes definition
├── seed_data.sql              # Pre-seeded users, workspaces, and comment logs
├── backend/                  # Spring Boot Maven Project
│   ├── pom.xml               # Explicit Lombok & JDK 23 Maven configurations
│   └── src/main/java/        # Java package hierarchy (entities, services, controllers)
└── frontend/                 # React.js + Vite Application
    ├── package.json          # Dependency packages (zustand, recharts, motion)
    └── src/                  # React source files (stores, pages, styles)
```

---

## 🏁 Quick Start Setup

### Prerequisites
- **Node.js** (v18+)
- **Java JDK** (v17 or v23)
- **Maven** (v3.8+)
- **Docker** (Optional, for MySQL container)

### 1. Database Provisioning
You can spin up pre-configured MySQL instantly using the included Docker Compose file:
```bash
docker-compose up -d
```
*Note: The backend is profile-driven. If MySQL is not running, it automatically boots up with a schema-hydrated in-memory H2 database under the `dev` profile!*

### 2. Launch Spring Boot Backend
Navigate to the backend module and compile/run:
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
The REST API will boot on `http://localhost:8080/api` and the WebSocket endpoint will listen on `ws://localhost:8080/ws`.

### 3. Launch React Frontend
Navigate to the frontend module, install dependencies, and run the Vite dev server:
```bash
cd ../frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🔐 Credentials & Pre-Seeded Profiles
The database is pre-seeded (via `seed_data.sql` / H2 auto-loader) with the following accounts for instant testing. All passwords are encrypted with BCrypt hash for `password123`.

1. **Lead Engineer / Workspace Owner:**
   - **Username:** `alice_dev`
   - **Email:** `alice@taskflow.ai`
2. **Backend Specialist:**
   - **Username:** `bob_backend`
   - **Email:** `bob@taskflow.ai`
3. **UI/UX Designer:**
   - **Username:** `charlie_design`
   - **Email:** `charlie@taskflow.ai`

---

## 📈 Verification & Testing Suite
To verify that everything is functioning correctly:
- Run backend verification: `mvn test` in `/backend`.
- Build production assets: `npm run build` in `/frontend`.
- Run active instances in side-by-side browser windows to observe instantaneous drag-and-drop state syncing over WebSockets!
