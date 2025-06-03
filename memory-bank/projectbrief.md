### Project Description: CUET Class Management System
## Overview
The CUET Class Management System is a web application developed for Chittagong University of Engineering and Technology (CUET) to streamline academic operations. It manages class scheduling, course administration, attendance tracking, and user administration with role-based access for admins, teachers, and students (including Class Representatives, or CRs). The system enhances efficiency by integrating a modern TypeScript frontend with ShadCN components and a robust Golang backend, leveraging existing Lovable.dev templates as a foundation.
Technology Stack

    # Frontend:
        TypeScript: Ensures type safety for JavaScript development.
        ShadCN Components: Modern, customizable UI components for React (e.g., buttons, forms, charts).
        React.js: Framework for dynamic, component-based UI (standalone with Vite).
        Vite: Fast build tool and development server.
        React Router: Client-side routing for navigation.
        Axios: Handles HTTP requests to the backend API.
    # Backend:
        Golang: Powers the entire backend, including API endpoints, business logic, and server operations.
        Gin: Lightweight HTTP framework for routing and middleware in Golang.
        Supabase: Provides email-based authentication and PostgreSQL database management, integrated via Golang.
        Supabase Go Client: Official Go library (github.com/supabase-community/supabase-go) for seamless Supabase integration.
    # Authentication:
        Supabase Auth: JWT-based authentication with CUET-specific emails (e.g., u2309026@student.cuet.ac.bd), managed through Golang.
    # API:
        RESTful endpoints (e.g., /api/auth/signup, /api/student/classes) fully implemented in Golang, secured with JWT middleware.

## Existing Work

    Repository: https://github.com/lazy-boy4/cuet-class-nectar.git
    Frontend (Lovable.dev):
        Landing Page: templates/public/landing.tmpl (dark-themed CUET intro).
        Signup Page: templates/public/signup.tmpl (student/teacher forms).
        Login Page: templates/public/login.tmpl (single form).
        Static assets in static/ (CSS, JS, images like the CUET logo).
    Structure: Golang project with directories (cmd/, internal/, templates/, static/) and empty files initialized via a bash script.

## Features and Functionalities
1. Public Pages

    Landing Page (/): Introduces CUET and the system with signup/login CTAs.
    Signup Page (/signup):
        Student Form: CUET ID (e.g., "2309026"), full name, email (e.g., "u2309026@student.cuet.ac.bd"), password, department (dropdown of 12 CUET departments: "01 - Civil Engineering" to "12 - Materials and Metallurgical Engineering"), batch (e.g., "2023-2024"), section (optional), profile picture upload.
        Teacher Form: Full name, email (e.g., "faculty456@cuet.ac.bd"), password, department, profile picture upload.
    Login Page (/login): Email/password form with "Remember Me" checkbox and "Forgot Password" link.
    Forgot Password (/forgot-password): Email-based password reset flow.

2. Admin Features (Protected Routes)

    Dashboard (/admin): System overview (e.g., total users, active classes).
    Department Management (/admin/departments): CRUD operations for departments (e.g., "04 - Computer Science and Engineering").
    Course Management (/admin/courses): CRUD for courses (e.g., "Math-191, 3 credits").
    Class Management (/admin/classes): CRUD for classes (e.g., "CSE-21 Section A").
    User Management (/admin/users): Add, edit, or delete students and teachers.
    Bulk Student Upload (/admin/bulk-upload): Import students via CSV (e.g., CUET ID, name, email, batch).
    Assign Teachers (/admin/assign-teachers): Link teachers to classes.
    Promote CRs (/admin/promote-crs): Designate students as CRs.

3. Teacher Features (Protected Routes)

    Dashboard (/teacher): Overview of assigned classes and schedules.
    Class Management (/teacher/classes/:classId): Dynamic page per class with:
        Attendance recording.
        Notice posting.
        Schedule viewing/uploading.

4. Student Features (Protected Routes)

    Dashboard (/student): Overview of enrolled classes and notices.
        Attendance Tracker:
            Semester View: Pie chart showing overall attendance (e.g., "87%"), green for attended, red for missed, with totals (e.g., "40/45 classes").
            Course View: Bar graphs per course (e.g., "CSE-231: 92%").
    Profile (/student/profile): View/edit personal details (e.g., name, picture).
    Enroll (/student/enroll): Submit enrollment requests (requires CR approval).
    Class Details (/student/classes/:classId): View attendance, schedules, and notices; CRs can approve enrollments, upload PDF routines, set test dates, and post notices.

5. Shared Features

    Notice Board (/notices): Displays global and class-specific announcements.

## Project Structure
# Frontend (TypeScript + ShadCN + React.js)

cuet-class-nectar/
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable ShadCN UI (e.g., Button, Card, Chart)
│   │   ├── pages/               # React page components
│   │   │   ├── Landing.tsx      # Converted from landing.tmpl
│   │   │   ├── Signup.tsx       # Converted from signup.tmpl
│   │   │   ├── Login.tsx        # Converted from login.tmpl
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── admin/           # Admin pages
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Departments.tsx
│   │   │   │   ├── Courses.tsx
│   │   │   │   ├── Classes.tsx
│   │   │   │   ├── Users.tsx
│   │   │   │   ├── BulkUpload.tsx
│   │   │   │   ├── AssignTeachers.tsx
│   │   │   │   └── PromoteCRs.tsx
│   │   │   ├── teacher/         # Teacher pages
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   └── Class.tsx
│   │   │   ├── student/         # Student pages
│   │   │   │   ├── Dashboard.tsx
│   │   │   │   ├── Profile.tsx
│   │   │   │   ├── Enroll.tsx
│   │   │   │   └── Class.tsx
│   │   │   └── shared/          # Shared pages
│   │   │       └── Notices.tsx
│   │   ├── api/                 # Axios API calls (e.g., authApi.ts)
│   │   ├── types/               # TS interfaces (e.g., User, Class)
│   │   ├── App.tsx              # Routing setup
│   │   └── main.tsx             # Entry point
│   ├── public/                  # Static assets (e.g., CUET logo)
│   ├── package.json             # Dependencies (react, shadcn/ui, axios, etc.)
│   └── tsconfig.json            # TypeScript config

# Backend (Golang + Supabase)

cuet-class-nectar/
├── cmd/
│   └── server/
│       └── main.go          # Server entry point
├── internal/
│   ├── handlers/            # API endpoint handlers
│   │   ├── public.go        # Public routes (landing, signup, login)
│   │   ├── admin.go         # Admin routes (departments, courses, etc.)
│   │   ├── teacher.go       # Teacher routes (class management)
│   │   ├── student.go       # Student routes (dashboard, profile, etc.)
│   │   └── notices.go       # Notice board routes
│   ├── models/              # Data structs for Supabase tables
│   │   ├── department.go    # Department struct
│   │   ├── course.go        # Course struct
│   │   ├── class.go         # Class struct
│   │   ├── user.go          # User struct
│   │   └── notice.go        # Notice struct
│   ├── services/            # Business logic and Supabase operations
│   │   ├── auth_service.go  # Authentication logic
│   │   ├── user_service.go  # User management logic
│   │   ├── class_service.go # Class management logic
│   │   └── notice_service.go # Notice management logic
│   └── supabase/            # Supabase integration
│       └── client.go        # Supabase client initialization
├── static/                  # Existing Lovable.dev assets (to move to frontend/public)
├── templates/               # Legacy Lovable.dev templates (to phase out)
├── go.mod                   # Go module dependencies
└── go.sum                   # Dependency checksums

# Supabase Database Schema

    users: 
        id (uuid): Unique identifier.
        email (text): User email (e.g., "u2309026@student.cuet.ac.bd").
        full_name (text): User's full name.
        dept_code (varchar): Department code (e.g., "04").
        role (text): Role (e.g., "admin", "teacher", "student", "cr").
        student_id (varchar): CUET ID for students (e.g., "2309026").
        batch (text): Academic batch (e.g., "2023-2024").
        section (text): Class section (optional).
        picture_url (text): URL to profile picture.
        created_at (timestamp): Account creation timestamp.
    departments: 
        id (serial): Unique identifier.
        code (varchar): Department code (e.g., "01").
        name (text): Department name (e.g., "Civil Engineering").
    courses: 
        id (serial): Unique identifier.
        code (text): Course code (e.g., "Math-191").
        name (text): Course name.
        credits (int): Credit hours.
    classes: 
        id (serial): Unique identifier.
        dept_id (int): Foreign key to departments.
        session (text): Academic session (e.g., "2023-2024").
        section (text): Class section (e.g., "A").
        code (text): Class code (e.g., "CSE-21").
    notices: 
        id (serial): Unique identifier.
        class_id (int, nullable): Foreign key to classes (null for global notices).
        content (text): Notice content.
        author_id (uuid): Foreign key to users.

## Backend Implementation in Golang
The entire backend is written in Golang, leveraging its performance, concurrency, and robust ecosystem:
Key Components

    Server Setup (cmd/server/main.go):
        Initializes the Gin router.
        Configures Supabase client with API URL and Anon Key.
        Serves frontend static files in production.
        Defines all API routes.
    Handlers (internal/handlers/):
        public.go: Handles unauthenticated routes (/, /signup, /login, /forgot-password).
        admin.go: Manages admin-specific endpoints (e.g., /api/admin/departments).
        teacher.go: Manages teacher-specific endpoints (e.g., /api/teacher/classes/:id).
        student.go: Manages student-specific endpoints (e.g., /api/student/dashboard).
        notices.go: Manages notice board endpoints (e.g., /api/notices).
    Models (internal/models/):
        Defines Go structs mirroring Supabase tables (e.g., User, Department, Course).
        Includes JSON tags for serialization (e.g., json:"email").
    Services (internal/services/):
        auth_service.go: Implements signup, login, and password reset using Supabase Auth.
        user_service.go: Handles CRUD operations for users (e.g., bulk upload, role promotion).
        class_service.go: Manages class-related operations (e.g., attendance, schedules).
        notice_service.go: Manages notice creation and retrieval.
    Supabase Integration (internal/supabase/client.go):
        Initializes a single Supabase client instance with Golang.
        Provides reusable functions for auth and database queries.

## Authentication Flow

    Signup: 
        Golang handler (/api/auth/signup) receives form data, calls Supabase Auth's SignUp method, and inserts additional user data into the users table.
    Login: 
        Golang handler (/api/auth/login) authenticates via Supabase Auth's SignIn, returns a JWT, and sets it in a secure cookie.
    Protected Routes: 
        Golang middleware validates the JWT, retrieves user role from users, and restricts access accordingly.

## Error Handling

    Golang handlers return JSON responses (e.g., {"error": "Invalid credentials"}) with appropriate HTTP status codes (e.g., 400, 401).

## Development Guidelines

    Frontend:
        Convert templates/public/*.tmpl to React components (*.tsx) with ShadCN styling.
        Use Axios to call Golang API endpoints.
        Implement React Router for role-based navigation.
    Backend:
        Use Golang with Gin to define and serve all API endpoints.
        Integrate Supabase via the Go client for authentication and database operations.
        Secure routes with Golang-implemented JWT middleware.
    Error Handling:
        Backend: Return JSON { "error": "message" }.
        Frontend: Display errors with ShadCN alerts.

flowchart TD
    PB[Project Description.md] --> PC[productContext.md]
    PB --> SP[systemPatterns.md]
    PB --> TC[techContext.md]
    PC --> AC[activeContext.md]
    SP --> AC
    TC --> AC
    AC --> P[progress.md]