# CUET ClassNectar - Backend API Documentation

Version: 1.0 (Phase 1 & 2 Backend Features)
Base URL: `/api`

## Table of Contents
1. [Authentication](#authentication)
2. [Admin Endpoints](#admin-endpoints)
3. [Teacher Endpoints](#teacher-endpoints)
4. [Student Endpoints](#student-endpoints)
5. [Shared Endpoints](#shared-endpoints)
6. [General Information](#general-information)

## General Information
- All request and response bodies are in JSON format.
- Protected routes require an `Authorization: Bearer <JWT_ACCESS_TOKEN>` header.
- Successful responses typically use `200 OK` or `201 Created` status codes.
- Error responses use appropriate HTTP status codes (400, 401, 403, 404, 409, 500) and include a JSON body: `{"error": "descriptive message"}`.
- Dates are generally expected/returned in `YYYY-MM-DD` format unless specified (e.g., for full timestamps).
- UUIDs are used for user identifiers.

## 1. Authentication (`/auth`)

### POST /auth/signup
- **Description**: Registers a new user (student or teacher).
- **Request Body**: `models.SignUpInput` (email, password, fullName, role, and role-specific fields like dept_code, student_id, batch).
- **Success Response (201 Created)**: `{"message": "User signed up...", "userId": "uuid", "email": "user@example.com"}`
- **Error Responses**: 400 (Invalid input), 409 (Email already exists).

### POST /auth/login
- **Description**: Logs in an existing user.
- **Request Body**: `models.SignInInput` (email, password).
- **Success Response (200 OK)**: `{"message": "User signed in...", "access_token": "jwt", "refresh_token": "jwt", ...}`
- **Error Responses**: 401 (Invalid credentials), 403 (Email not confirmed if applicable).

## 2. Admin Endpoints (`/admin/...`)
*Requires Admin Role. All routes are prefixed with `/api/admin`.*

### Departments (`/departments`)
- `POST /`: Create Department. Body: `models.DepartmentInput`.
- `GET /`: List Departments.
- `GET /:id`: Get Department by ID.
- `PUT /:id`: Update Department. Body: `models.DepartmentInput`.
- `DELETE /:id`: Delete Department.

### Courses (`/courses`)
- Similar CRUD endpoints as Departments, using `models.CourseInput`.

### Classes (`/classes`)
- Similar CRUD endpoints, using `models.ClassInput`.
- `GET /:classId/teachers`: List teachers assigned to a class. (Route actually under `/api/admin/classes/:classId/teachers`)

### User Management (`/users`)
- `POST /`: Admin Create User. **STUBBED/NON-FUNCTIONAL for auth.users creation due to library limits.** Expect 501 Not Implemented or error. (Manages `public.users` if auth user created externally).
- `GET /`: List all users (from `public.users`).
- `GET /:id`: Get user by ID.
- `PUT /:id`: Admin Update User Profile. Body: `models.AdminUpdateUserInput`.
- `DELETE /:id`: Admin Delete User. **STUBBED/NON-FUNCTIONAL for auth.users deletion.** Expect 501 or error. (Manages `public.users` if auth user deleted externally).
- `POST /:userId/promote-cr`: Promote student to CR.
- `POST /:userId/demote-cr`: Demote CR to student.

### Bulk Student Profile Upload (`/students/bulk-upload-profiles`)
- `POST /`: Upload CSV file (form field: `csv_file`) to create/update student profiles in `public.users`. **Does not create auth.users entries.**

### Class-Teacher Assignments (`/class-teacher-assignments`)
- `POST /assign`: Assign teacher(s) to class. Body: `models.AssignTeachersInput`.
- `POST /unassign`: Unassign teacher(s) from class. Body: `models.UnassignTeachersInput`.

### Global Notices (`/notices/global`)
- `POST /`: Create a global notice. Body: `models.NoticeInput` (ClassID should be null or omitted).

## 3. Teacher Endpoints (`/teacher/...`)
*Requires Teacher or Admin Role. All routes are prefixed with `/api/teacher`.*

### Dashboard (`/dashboard`)
- `GET /`: Get aggregated data for teacher dashboard (assigned classes, upcoming events, recent notices).

### Notice Management
- `POST /notices`: Create a class notice. Body: `models.NoticeInput` (ClassID is required).
- `GET /classes/:classId/notices`: Get notices for a specific class.
- `PUT /notices/:noticeId`: Update own notice. Body: `{ "content": "new content" }`.
- `DELETE /notices/:noticeId`: Delete own notice.

### Attendance Management (`/classes/:classId/attendance`)
- `POST /`: Upsert attendance records. Body: `models.AttendanceInput`.
- `GET /`: Get attendance for class on a date. Query param: `?date=YYYY-MM-DD`.

### Schedule Management
- `POST /classes/:classId/schedule-entries`: Create schedule entry. Body: `models.ScheduleEntryInput`.
- `GET /classes/:classId/schedule-entries`: Get schedule for a class.
- `PUT /schedule-entries/:entryId`: Update schedule entry. Body: `models.ScheduleEntryInput`.
- `DELETE /schedule-entries/:entryId`: Delete schedule entry.

## 4. Student Endpoints (`/student/...`)
*Requires Authenticated User Role (Student or CR for specific actions). All routes are prefixed with `/api/student`.*

### Dashboard (`/dashboard`)
- `GET /`: Get aggregated data for student dashboard.

### Profile Management (`/profile`)
- `GET /`: Get own student profile.
- `PUT /`: Update own student profile. Body: `models.StudentProfileUpdateInput`.

### Enrollment Management
- `POST /enrollments/request`: Request enrollment in a class. Body: `models.EnrollmentRequestInput`.
- `GET /enrollments`: Get own enrollment history/status.
- `GET /available-classes`: List classes available for enrollment.

### CR Enrollment Review (`/classes/:classId/enrollments/...`)
*Requires CR Role for the specified :classId.*
- `GET /pending`: CR views pending enrollment requests for their class.
- `POST /review`: CR approves/rejects a request. Body: `models.ReviewEnrollmentInput`.

### CR Class Event Management (`/classes/:classId/events/...`)
*Requires CR Role for the specified :classId for CUD operations.*
- `POST /events`: CR creates an event for their class. Body: `models.ClassEventInput`.
- `PUT /events/:eventId`: CR updates an event for their class. Body: `models.ClassEventInput`.
- `DELETE /events/:eventId`: CR deletes an event for their class.
*Note: Viewing class events is typically a shared endpoint.*

## 5. Shared Endpoints (`/shared/...`)
*Requires Authenticated User Role. All routes are prefixed with `/api/shared`.*

### Global Notices (`/notices/global`)
- `GET /`: Any authenticated user can retrieve global notices.

### Student Attendance (`/classes/:classId/students/:studentId/attendance`)
- `GET /`: View specific student's attendance in a specific class. (Authorization: Student for own, Teacher/Admin for class members).

### Class Schedule (`/classes/:classId/schedule`)
- `GET /`: Any authenticated user can view a class schedule.

### Class Events (`/classes/:classId/events`)
- `GET /`: Any authenticated user can view events for a class.

## User Profile Picture Upload

### POST /api/me/profile-picture
- **Description**: Authenticated user uploads/updates their own profile picture.
- **Request**: Multipart form data with a file field named `profile_picture`.
- **Success Response (200 OK)**: `{"message": "Profile picture uploaded...", "picture_url": "dummy_or_actual_url"}`.
- **Note**: Actual file upload to Supabase Storage is currently **STUBBED** due to library issues. A dummy URL is generated and stored in the DB.
