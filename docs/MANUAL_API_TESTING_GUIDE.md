# Manual API Integration Testing Guide - CUET ClassNectar

This guide outlines key scenarios for manually testing the CUET ClassNectar backend API endpoints.
Use a tool like Postman, Insomnia, or `curl`.

**Prerequisites:**
1.  The Go backend server must be running.
2.  Supabase services (Auth, Database) must be accessible.
3.  Ensure you have credentials (email/password) for users with different roles (admin, teacher, student, cr) for testing authorization. Create these via Supabase Dashboard or the API's signup endpoint.
4.  Obtain JWT (access tokens) after logging in with these users to use in `Authorization: Bearer <token>` headers for protected endpoints.
5.  **Important**: Apply the `rls_policies.sql` script to your Supabase database before extensive testing to ensure data security is also tested.

## I. Authentication (`/api/auth`)

1.  **User Signup (`POST /api/auth/signup`)**
    *   Test with valid student data (email, password, name, role='student', student_id, dept_code, batch). Expect 201 Created. Verify user in Supabase `auth.users` and `public.users`.
    *   Test with valid teacher data (email, password, name, role='teacher', dept_code). Expect 201.
    *   Test with duplicate email. Expect 409 Conflict.
    *   Test with missing required fields (e.g., email, password, role). Expect 400 Bad Request.
    *   Test with invalid role (e.g., role='unknown'). Expect 400.
    *   Test with invalid email format. Expect 400.
    *   Test with short password. Expect 400.

2.  **User Login (`POST /api/auth/login`)**
    *   Test with valid credentials for each role. Expect 200 OK and JWT tokens (access_token, refresh_token).
    *   Test with invalid email. Expect 401 Unauthorized.
    *   Test with incorrect password. Expect 401.
    *   Test with unconfirmed email (if email confirmation is enabled in Supabase). Expect 403 or similar.

## II. Admin Endpoints (`/api/admin/...`)
*All these routes require an Admin user's JWT.*

### A. Departments (`/api/admin/departments`)
    *   `POST /`: Create a new department. Test with valid and invalid (e.g., duplicate code, missing name) data.
    *   `GET /`: List all departments.
    *   `GET /:id`: Get a specific department by ID. Test with valid and invalid ID.
    *   `PUT /:id`: Update a department. Test with valid and invalid ID, and valid/invalid data.
    *   `DELETE /:id`: Delete a department. Test with valid and invalid ID. Consider FK constraints if departments are linked.

### B. Courses (`/api/admin/courses`)
    *   Similar CRUD tests as Departments (POST, GET all, GET :id, PUT :id, DELETE :id).
    *   Test validation for `code`, `name`, `credits`.

### C. Classes (`/api/admin/classes`)
    *   Similar CRUD tests.
    *   Test validation for `dept_id` (must exist), `session`, `code`. Test unique constraints (e.g., dept_id, session, section).

### D. User Management (`/api/admin/users`)
    *   `POST /`: Create user (AdminCreateUser). **Note: This is stubbed in backend due to library limits.** Test that it returns the "not supported" error.
    *   `GET /`: List all users.
    *   `GET /:id`: Get a specific user by ID.
    *   `PUT /:id`: Update a user's profile (e.g., name, role, dept_code). Test changing roles.
    *   `DELETE /:id`: Delete user. **Note: This is stubbed for auth.users deletion.** Test that it returns the "not supported" error or only deletes from `public.users`.

### E. Promote/Demote CR (`/api/admin/users/:userId/...`)
    *   `POST /:userId/promote-cr`: Promote a 'student' to 'cr'. Test with valid student ID. Test with non-student ID (expect error). Test with non-existent user ID.
    *   `POST /:userId/demote-cr`: Demote a 'cr' to 'student'. Test with valid CR ID. Test with non-CR ID.

### F. Bulk Student Profile Upload (`POST /api/admin/students/bulk-upload-profiles`)
    *   Upload a valid CSV file with student profile data. Expect 200 OK or 207 Multi-Status. Verify `public.users` updated.
    *   Upload CSV with some invalid rows (e.g., missing required fields). Expect 207 with error details.
    *   Upload non-CSV file. Expect 400.
    *   Upload empty CSV. Expect 400.
    *   **Note**: This only populates `public.users`, does not create `auth.users` entries.

### G. Class-Teacher Assignments (`/api/admin/class-teacher-assignments` & `/api/admin/classes/:classId/teachers`)
    *   `POST /assign`: Assign teacher(s) to a class. Test with valid class/teacher IDs. Test assigning non-teacher role. Test assigning non-existent user/class. Test assigning already assigned teacher (expect error or graceful ignore).
    *   `POST /unassign`: Unassign teacher(s) from a class.
    *   `GET /api/admin/classes/:classId/teachers`: List teachers assigned to a specific class.

### H. Global Notices (`POST /api/admin/notices/global`)
    *   Create a global notice. Verify it appears in shared global notice list.

## III. Teacher Endpoints (`/api/teacher/...`)
*All these routes require a Teacher user's JWT (or Admin JWT).*

### A. Teacher Dashboard (`GET /api/teacher/dashboard`)
    *   Verify response structure (`assigned_classes`, `upcoming_events`, `recent_notices`).
    *   Check if data accurately reflects the teacher's context.

### B. Notice Management
    *   `POST /api/teacher/notices`: Create a class notice (must include `class_id`). Test authorization (e.g., teacher assigned to that class - *current backend TODO for full validation*).
    *   `GET /api/teacher/classes/:classId/notices`: Get notices for a specific class.
    *   `PUT /api/teacher/notices/:noticeId`: Update own notice. Test trying to update another's notice (expect 403/404).
    *   `DELETE /api/teacher/notices/:noticeId`: Delete own notice. Test trying to delete another's notice.

### C. Attendance Management (`/api/teacher/classes/:classId/attendance`)
    *   `POST /`: Upsert attendance records for students in a class on a specific date. Test with new records and updating existing ones.
    *   `GET /?date=YYYY-MM-DD`: Get attendance for a class on a date. Verify student names are included.

### D. Schedule Management
    *   `POST /api/teacher/classes/:classId/schedule-entries`: Create a schedule entry for a class.
    *   `GET /api/teacher/classes/:classId/schedule-entries`: Get schedule for a class.
    *   `PUT /api/teacher/schedule-entries/:entryId`: Update a schedule entry.
    *   `DELETE /api/teacher/schedule-entries/:entryId`: Delete a schedule entry.
    *   Test authorization for all (teacher should be associated with the class).

## IV. Student Endpoints (`/api/student/...`)
*All these routes require a Student user's JWT (or CR/Teacher/Admin JWTs for some shared views).*

### A. Student Dashboard (`GET /api/student/dashboard`)
    *   Verify response structure (`enrolled_classes`, `recent_notices`, `attendance_stats`).
    *   Check data accuracy for the logged-in student.

### B. Profile Management
    *   `GET /api/student/profile`: View own profile.
    *   `PUT /api/student/profile`: Update own profile (e.g., name, picture_url (dummy), section). Test trying to update restricted fields (e.g., role, email - expect ignore or error).

### C. Enrollment
    *   `POST /api/student/enrollments/request`: Request enrollment in a class. Test with valid class ID. Test requesting for already approved/pending class (expect conflict). Test with non-existent class ID.
    *   `GET /api/student/enrollments`: Get own enrollment history/status.
    *   `GET /api/student/available-classes`: List classes available for enrollment.

### D. CR Enrollment Review (`/api/student/classes/:classId/enrollments/...`)
*These routes require a CR user's JWT and `classId` in path must be a class the CR represents.*
    *   `GET /pending`: CR views pending enrollment requests for their class.
    *   `POST /review`: CR approves/rejects a pending request. Test with valid `student_id_to_review` and `new_status`. Test trying to review non-pending request. Test with student not pending for *this* class. Test as non-CR (expect 403). Test as CR for a *different* class (expect 403).

### E. CR Class Event Management (`/api/student/classes/:classId/events/...`)
*These routes require a CR user's JWT for CUD, `classId` in path must be their class.*
    *   `POST /events`: CR creates an event (e.g., test date) for their class.
    *   `PUT /events/:eventId`: CR updates an event they created for their class.
    *   `DELETE /events/:eventId`: CR deletes an event they created for their class.
    *   (Viewing events is often shared, see Shared Endpoints).

## V. Shared Endpoints (`/api/shared/...`)
*These routes require any authenticated user's JWT.*

1.  **Global Notices (`GET /api/shared/notices/global`)**
    *   Verify any authenticated user can retrieve global notices.
2.  **Student Attendance (`GET /api/shared/classes/:classId/students/:studentId/attendance`)**
    *   Student views their own attendance for a class.
    *   Test if student A can see student B's attendance (should be disallowed by RLS if properly configured and not overridden by broad teacher/admin access on this handler, or handler should check ownership).
3.  **Class Schedule (`GET /api/shared/classes/:classId/schedule`)**
    *   Any authenticated user can view a class schedule.
4.  **Class Events (`GET /api/shared/classes/:classId/events`)**
    *   Any authenticated user can view events for a class.

## VI. General API Tests
1.  **Authorization Errors:**
    *   Attempt to access protected routes without JWT. Expect 401.
    *   Attempt to access with invalid/expired JWT. Expect 401.
    *   Attempt admin routes as teacher/student/CR. Expect 403.
    *   Attempt teacher routes as student. Expect 403.
    *   Attempt CR routes as regular student. Expect 403.
2.  **Input Validation:**
    *   Send requests with missing required fields. Expect 400.
    *   Send requests with incorrectly formatted data (e.g., invalid email, invalid UUID, string instead of number). Expect 400.
    *   Test boundary conditions for string lengths, number ranges (e.g., `credits` for course).
3.  **Idempotency (where applicable):**
    *   e.g., multiple identical DELETE requests should result in the same state (first succeeds, subsequent ones might be 404 or succeed silently).
4.  **Pagination/Filtering (if implemented):**
    *   Test any list endpoints that support pagination (e.g., `?page=1&limit=10`) or filtering. (Note: Not explicitly implemented yet in backend services).
5.  **CORS Headers:**
    *   Verify `Access-Control-Allow-Origin` and other CORS headers are present and correctly configured if frontend is on a different domain/port. (Current backend allows `*` for dev).

This guide provides a starting point. Each endpoint may have more specific edge cases to consider. Remember to also check server logs for any unexpected errors during testing.
