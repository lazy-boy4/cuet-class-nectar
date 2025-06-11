# Project Progress - CUET ClassNectar

## Current Status (Backend Development Phase 1 Complete)
- **Frontend**: Previously reported as complete (React, TypeScript, Vite, ShadCN). Awaiting backend integration.
- **Backend API**: Core features implemented in Golang with Gin and Supabase.
  - Role-based access control (Admin, Teacher, CR, Student) is in place with JWT authentication.
  - Most CRUD operations for key entities are functional.
  - Some limitations exist with the current Go Supabase library (`nedpals/supabase-go@v0.5.0`) affecting Admin Auth operations and File Storage.
- **Database**: Schema setup for core tables assumed to be in place in Supabase. RLS policy script generated, pending manual application and testing.

## Backend Features Implemented

### ✅ Core Backend & Authentication
- **Go Project Structure**: Setup with `cmd/server`, `internal/handlers`, `internal/services`, `internal/models`.
- **Supabase Integration**: Using `nedpals/supabase-go@v0.5.0` client.
- **Authentication**:
    - User Signup (`/api/auth/signup`)
    - User Login (`/api/auth/login`) returning JWT.
    - `AuthMiddleware` to protect routes and extract user context (ID, Email, Role).
- **Role-Specific Middleware**:
    - `AdminRequiredMiddleware`
    - `TeacherRequiredMiddleware` (also allows Admins)
    - `CRRequiredMiddleware`

### ✅ Admin Features (`/api/admin/...`)
- **Department Management**: Full CRUD for university departments.
- **Course Management**: Full CRUD for courses.
- **Class Management**: Full CRUD for academic classes.
- **User Profile Management**:
    - List all users, Get user by ID.
    - Update any user's profile details in `public.users`.
    - *Limitation*: Admin creation of new `auth.users` entries and deletion of `auth.users` entries via the Go backend is **NOT currently functional** due to `nedpals/supabase-go` library limitations. These actions require external tools (e.g., Supabase Dashboard). Service functions are stubbed.
- **Bulk Student Profile Upload**:
    - Endpoint to upload CSV for populating `public.users` data for students.
    - Does not create `auth.users` entries (see limitation above).
- **Teacher-Class Assignments**: Assign/unassign teachers to classes, list teachers for a class.
- **Promote/Demote CRs**: Change a student's role to 'cr' or demote a 'cr' to 'student' in `public.users`.

### ✅ Teacher Features (`/api/teacher/...`)
- **Notice Management**:
    - Create, update, delete notices for assigned classes.
    - View notices for assigned classes.
    - (TODO: Full validation that teacher is assigned to the class for all operations).
- **Attendance Management**:
    - Record/update (upsert) attendance for multiple students in a class.
    - View attendance records by class and date (includes student names).
- **Schedule Management (Structured)**:
    - Create, update, delete schedule entries (day, time, course, room) for assigned classes.
    - View schedule entries for a class.
- **Teacher Dashboard**:
    - Endpoint (`/api/teacher/dashboard`) providing aggregated data:
        - Assigned classes (summary).
        - Upcoming schedule events (simplified list).
        - Recent class notices (summary).

### ✅ Student & CR Features (`/api/student/...`)
- **Student Dashboard**:
    - Endpoint (`/api/student/dashboard`) providing aggregated data:
        - Enrolled classes (summary).
        - Recent global and class notices (summary).
        - Basic overall attendance statistics.
- **Student Profile Management**:
    - View own profile (`/api/student/profile`).
    - Update own profile (limited fields like full name, picture URL, section).
- **Enrollment Management (Student)**:
    - Request enrollment in a class.
    - View own enrollment history and status.
    - List available classes for enrollment.
- **Enrollment Management (CR)**:
    - View pending enrollment requests for their class(es).
    - Approve or reject pending enrollment requests for their class(es).
    - (CR authorization for specific class is handled in service layer).
- **Class Event Management (CR)**:
    - CRs can create, update, and delete class-specific events (e.g., test dates, assignment deadlines) for their class(es).
    - View events for a class (also accessible to other roles via shared endpoint).

### ✅ Shared Features (Accessible by multiple roles, usually under `/api/shared/...` or public)
- **Global Notices**:
    - Admins can create global notices (`/api/admin/notices/global`).
    - Authenticated users can view global notices (`/api/shared/notices/global`).
- **View Schedules**: Authenticated users can view class schedules (`/api/shared/classes/:classId/schedule`).
- **View Attendance (Student Specific)**: Students can view their own attendance records for a class (`/api/shared/classes/:classId/students/:studentId/attendance`).
- **View Class Events**: Authenticated users can view events for a class (`/api/shared/classes/:classId/events`).

## Known Issues & Limitations
- **Admin Auth Operations**: `nedpals/supabase-go@v0.5.0` does not support admin creation/deletion of `auth.users`. Backend functions are stubbed.
- **File Uploads**: Profile picture uploads are stubbed (API exists, DB updates, but no actual file storage) due to `nedpals/supabase-go` Storage API issues. PDF routine uploads for CRs are not yet implemented and will face the same issue.
- **Database Query Ordering**: The `.Order()` method for Supabase queries (via `postgrest-go/v2`) caused build issues in the environment. Ordering has been omitted from some `GetAll` type queries.
- **RLS Policies**: SQL script for RLS policies has been generated. Manual application to the Supabase database and thorough testing are pending.
- **Comprehensive Testing**: Unit and integration tests for the backend are pending.
- **Frontend Integration**: Pending.

## Next Steps (New Plan)
1.  **Implement Remaining CR Features**: Specifically, PDF routine uploads (will be part of robust file uploads).
2.  **Implement Robust File Uploads**: Attempt to fix/workaround Supabase Storage issues for profile pictures and PDF routines.
3.  **Define and Apply Comprehensive RLS Policies**: Manually apply and test the generated RLS script.
4.  **Update Memory Bank**: Currently in progress.
5.  **Backend API Testing**: Write unit and integration tests.
6.  **Frontend Integration Support**: Collaborate and address issues.
7.  **Final Review and Submission**.

## Last Updated
- Date: [Current Date - to be filled by Void/Jules]
- Status: Backend Development Phase 1 (Core API Features) Complete. Phase 2 (Uploads, RLS, Testing, Integration) starting.
