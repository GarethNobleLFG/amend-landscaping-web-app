# Amend Landscaping Web Application & Enterprise Suite

A modern, multi-service platform powering Amend Landscaping LLC. The platform encompasses customer-facing booking and marketing web applications, a core REST API with PostgreSQL, an operational CERM (Customer & Enterprise Resource Management) portal with a dedicated Go backend, a transactional email microservice, and Prometheus observability.

---

## Services & Directory Structure

| Service / Directory | Tech Stack | Port (Host) | Description |
| :--- | :--- | :--- | :--- |
| **`frontend`** | React 19, Vite, Tailwind CSS v4, Framer Motion | `5174` (or `5173`) | Customer-facing marketing site, pricing, policy pages, booking flow, and legacy admin dashboard. |
| **`api`** | Node.js, Express 5, Sequelize ORM, PostgreSQL | `3001` | Core REST API managing customer appointments, services, image registry, testimonials, and contacts. |
| **`cerm-frontend`** | Qwik City, TypeScript, Tailwind CSS v4 | `5175` | Internal enterprise operations app for field teams, schedule management, job profiles, and user administration. |
| **`cerm-api`** | Go 1.26, Fiber v2, PostgreSQL, golang-migrate | `8080` | High-performance CERM backend handling auth (RBAC), job profile assignments, and team management. |
| **`email-service-api`** | Go 1.23, Fiber v2, SMTP | `8081` | Microservice handling automated HTML transactional emails (confirmations, approvals, cancellations, notifications). |
| **`db` & `cerm-db`** | PostgreSQL 15 Alpine | `5433`, `5434` | Dedicated database instances for Core API and CERM. |

---

## Service Details

### 1. Customer Frontend (`/frontend`)
Single Page Application (SPA) providing an interactive experience for landscaping clients:
- **Landing & Marketing** (`/`, `/about`, `/commercial`, `/pricing`, `/policies`, `/privacy`, `/terms`)
- **Booking Workflow** (`/book`): Multi-step service request form with date scheduling and commercial toggle.
- **Admin Dashboard** (`/admin`, `/admin-dashboard`): Quick management interface for approving, denying, and archiving incoming booking requests.

### 2. Core API (`/api`)
Built with Express.js and Sequelize ORM on PostgreSQL, with Prometheus metrics instrumentation (`/metrics`) and Supabase/Sharp file storage.

#### Key Endpoints:
- **Appointments (`/appointments`)**:
  - `POST /` — Submit new appointment request (triggers confirmation emails).
  - `GET /` — List all appointments *(Admin Auth required)*.
  - `GET /:id` — Get appointment details *(Admin Auth required)*.
  - `PUT /:id` — Update appointment record *(Admin Auth required)*.
  - `PATCH /:id/approve` — Approve appointment and trigger customer notification.
  - `PATCH /:id/deny` — Deny request and notify customer.
  - `PATCH /:id/cancel` — Cancel appointment.
  - `PATCH /:id/seen` — Mark appointment as seen by admin.
  - `PATCH /:id/archive` — Soft-archive completed/stale appointments.
- **Services (`/services`)**: Public catalog of landscaping services and admin CRUD endpoints.
- **Testimonials & Feedback (`/testimonies`, `/feedback`)**: Public review retrieval and submission.
- **Image Registry & Landing Images (`/images`, `/landing-images`)**: Upload and manage project showcase assets.
- **Contacts (`/contacts`)**: Business directory and address book.
- **Users (`/users/login`)**: Admin JWT authentication.

### 3. CERM Operations API (`/cerm-api`)
Go and Fiber backend implementing Role-Based Access Control (`ADMIN`, `TEAM LEAD`, `EMPLOYEE`):
- **Auth (`/api/auth`)**: `/signup`, `/signin`, `/me` (JWT authentication).
- **Users (`/api/users`)**: User directory and role management.
- **Job Profiles (`/api/job-profiles`)**: Approved/unapproved job pipelines, payouts, crew schedules, and admin notes.
- **Field Teams (`/api/teams`)**: Crew management and route assignment.
- **Proxy Endpoints (`/api/amend/services`, `/api/jobs/approve`, `/api/jobs/deny`)**: Bridges CERM operations with the Core API and Email Microservice.

### 4. CERM Frontend (`/cerm-frontend`)
Built using Qwik City for instant interactivity and low latency:
- **Operations Dashboard** (`/(app)/dashboard`)
- **Intake Pipeline** (`/(app)/intake`)
- **Job Profiles** (`/(app)/job-profiles`)
- **Teams & Crew Management** (`/(app)/teams`)
- **User Management** (`/(app)/user-management`)

### 5. Email Service API (`/email-service-api`)
Decoupled Go microservice providing templated HTML email delivery:
- `POST /api/emails/confirm`: Send customer booking confirmation receipt.
- `POST /api/emails/approve`: Send booking acceptance notice with custom notes.
- `POST /api/emails/deny`: Send polite denial notification.
- `POST /api/emails/admin/notify`: Send operational alert to Amend Landscaping management.

---

## Environment Configuration

Create `.env` files in their respective folders:

### `api/.env`
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgres://postgres:password@localhost:5433/amend_landscaping
JWT_SECRET=your_jwt_secret_key
COMPANY_USER=your_company_email@gmail.com
COMPANY_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@amendlandscaping.com
```

### `cerm-api/.env`
```env
PORT=8080
DATABASE_URL=postgres://cerm_user:cerm_password@localhost:5434/cerm_db?sslmode=disable
JWT_SECRET=your_cerm_jwt_secret
AMEND_API_URL=http://localhost:3001
EMAIL_SERVICE_URL=http://localhost:8081
```

### `email-service-api/.env`
```env
PORT=8081
COMPANY_USER=your_company_email@gmail.com
COMPANY_PASS=your_gmail_app_password
ADMIN_EMAIL=admin@amendlandscaping.com
```

---

## Getting Started (Docker Compose)

The easiest way to spin up the entire ecosystem (databases, APIs, and frontends) is using Docker Compose:

```bash
# Start all services with hot-reloading
docker compose up --build

# Run in detached mode
docker compose up -d

# Stop all containers
docker compose down
```

### Port Mapping Summary
- **Core Frontend**: `http://localhost:5174`
- **Core API**: `http://localhost:3001`
- **Postgres (Core DB)**: `localhost:5433`
- **CERM Frontend**: `http://localhost:5175`
- **CERM API**: `http://localhost:8080`
- **Postgres (CERM DB)**: `localhost:5434`
- **Email Service**: `http://localhost:8081`

---

## Local Development (Without Docker)

### Core API (`/api`)
```bash
cd api
npm install
npm run dev # Runs database migrations and nodemon
```

### Customer Frontend (`/frontend`)
```bash
cd frontend
npm install
npm run dev # Vite server at http://localhost:5173
```

### CERM Backend (`/cerm-api`)
```bash
cd cerm-api
make run
# Database migration shortcuts:
make migrate-up
make migrate-down
make import-appointments # Import appointments from Core DB to CERM
```

### CERM Frontend (`/cerm-frontend`)
```bash
cd cerm-frontend
npm install
npm run dev # Qwik development server
```

### Email Microservice (`/email-service-api`)
```bash
cd email-service-api
go run ./cmd/api/main.go
```

---

## Testing & Quality Assurance

- **Core API Tests**: `cd api && npm test` (Jest & Supertest)
- **Core API Linting**: `cd api && npm run lint`
- **Frontend Linting**: `cd frontend && npm run lint`
- **CERM API Tests**: `cd cerm-api && make test`
- **CERM Frontend Type-check**: `cd cerm-frontend && npm run build.types`

---

## CI / CD Pipelines

Automated workflows are located in `.github/workflows/`:
- `ci.yml`: Runs automated linting and unit test suites across all services on Pull Requests.
- `deploy-dev-api.yml` & `deploy-dev-frontend.yml`: Continuous deployment to staging environments.
- `deploy-prod-api.yml`, `deploy-prod-frontend.yml`, and `deploy-prod-email-service-api.yml`: Production deployment pipelines.
