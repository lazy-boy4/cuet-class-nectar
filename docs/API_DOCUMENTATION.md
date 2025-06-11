# CUET ClassNectar - Backend API Documentation

Version: 1.0 (Phase 1 & 2 Backend Features, including File Upload stubs)
Base URL: `/api`

## Table of Contents
1. [Authentication](#authentication)
2. [Admin Endpoints](#admin-endpoints)
3. [Teacher Endpoints](#teacher-endpoints)
4. [Student Endpoints](#student-endpoints)
5. [Shared Endpoints](#shared-endpoints)
6. [User Profile Picture Upload](#user-profile-picture-upload)
7. [CR Class Routine PDF Upload](#cr-class-routine-pdf-upload)
8. [Global Search](#global-search)
9. [General Information](#general-information)

## General Information
- All request and response bodies are in JSON format.
- Protected routes require an `Authorization: Bearer <JWT_ACCESS_TOKEN>` header.
- Successful responses typically use `200 OK` or `201 Created` status codes.
- Error responses use appropriate HTTP status codes (400, 401, 403, 404, 409, 500) and include a JSON body: `{"error": "descriptive message"}`.
- Dates are generally expected/returned in `YYYY-MM-DD` format unless specified.
- UUIDs are used for user identifiers.
- **IMPORTANT NOTE ON FILE UPLOADS**: Due to limitations with the current Supabase Go client library's Storage API, actual file uploads to Supabase Storage are **STUBBED**. API endpoints for file uploads will process metadata and update database records with a deterministically generated (dummy) URL, but no file will be physically stored in Supabase Storage via the backend. This affects Profile Pictures and CR PDF Routines.

## 1. Authentication (`/auth`)
### POST /auth/signup
- **Description**: Registers a new user.
- **Request Body**: `models.SignUpInput`.
- **Success Response (201 Created)**: `{"message": "User signed up...", ...}`
### POST /auth/login
- **Description**: Logs in an existing user.
- **Request Body**: `models.SignInInput`.
- **Success Response (200 OK)**: `{"message": "User signed in...", "access_token": "jwt", ...}`

## 2. Admin Endpoints (`/admin/...`)
*Requires Admin Role. Prefixed with `/api/admin`.*
### Departments (`/departments`)
- CRUD endpoints (POST, GET, GET /:id, PUT /:id, DELETE /:id) for `models.DepartmentInput`.
### Courses (`/courses`)
- CRUD endpoints for `models.CourseInput`.
### Classes (`/classes`)
- CRUD endpoints for `models.ClassInput`.
- `GET /:classId/teachers`: List teachers for a class.
### User Management (`/users`)
- `POST /`: Admin Create User (**STUBBED** for auth.users creation).
- `GET /`: List all users.
- `GET /:id`: Get user by ID.
- `PUT /:id`: Admin Update User Profile (`models.AdminUpdateUserInput`).
- `DELETE /:id`: Admin Delete User (**STUBBED** for auth.users deletion).
- `POST /:userId/promote-cr`: Promote student to CR.
- `POST /:userId/demote-cr`: Demote CR to student.
### Bulk Student Profile Upload (`/students/bulk-upload-profiles`)
- `POST /`: Upload CSV (form field: `csv_file`) for student profiles in `public.users`.
### Class-Teacher Assignments (`/class-teacher-assignments`)
- `POST /assign`: Assign teachers (`models.AssignTeachersInput`).
- `POST /unassign`: Unassign teachers (`models.UnassignTeachersInput`).
### Global Notices (`/notices/global`)
- `POST /`: Create global notice (`models.NoticeInput`, ClassID=null).

## 3. Teacher Endpoints (`/teacher/...`)
*Requires Teacher or Admin Role. Prefixed with `/api/teacher`.*
### Dashboard (`/dashboard`)
- `GET /`: Aggregated data for teacher dashboard.
### Notice Management
- `POST /notices`: Create class notice (`models.NoticeInput`, ClassID required).
- `GET /classes/:classId/notices`: Get notices for a class.
- `PUT /notices/:noticeId`: Update own notice.
- `DELETE /notices/:noticeId`: Delete own notice.
### Attendance Management (`/classes/:classId/attendance`)
- `POST /`: Upsert attendance (`models.AttendanceInput`).
- `GET /`: Get attendance for class on date (`?date=YYYY-MM-DD`).
### Schedule Management
- `POST /classes/:classId/schedule-entries`: Create schedule entry (`models.ScheduleEntryInput`).
- `GET /classes/:classId/schedule-entries`: Get schedule for class.
- `PUT /schedule-entries/:entryId`: Update schedule entry.
- `DELETE /schedule-entries/:entryId`: Delete schedule entry.

## 4. Student Endpoints (`/student/...`)
*Requires Authenticated User Role. Prefixed with `/api/student`.*
### Dashboard (`/dashboard`)
- `GET /`: Aggregated data for student dashboard.
### Profile Management (`/profile`)
- `GET /`: Get own student profile.
- `PUT /`: Update own student profile (`models.StudentProfileUpdateInput`).
### Enrollment Management
- `POST /enrollments/request`: Request enrollment (`models.EnrollmentRequestInput`).
- `GET /enrollments`: Get own enrollment history.
- `GET /available-classes`: List available classes.
### CR Enrollment Review (`/classes/:classId/enrollments/...`)
*Requires CR Role for :classId.*
- `GET /pending`: CR views pending requests.
- `POST /review`: CR approves/rejects request (`models.ReviewEnrollmentInput`).
### CR Class Event Management (`/classes/:classId/events/...`)
*Requires CR Role for :classId for CUD.*
- `POST /events`: CR creates event (`models.ClassEventInput`).
- `PUT /events/:eventId`: CR updates event.
- `DELETE /events/:eventId`: CR deletes event.
*(Viewing events is via Shared Endpoint)*
### CR Class Routine PDF Upload (`/classes/:classId/routine`)
*Requires CR Role for :classId.*
- `POST /`: Upload/replace class routine PDF (form field: `routine_pdf`). **STORAGE STUBBED.**
- `DELETE /`: Delete class routine PDF metadata. **STORAGE STUBBED.**
*(Viewing routine is via Shared Endpoint)*

## 5. Shared Endpoints (`/shared/...`)
*Requires Authenticated User Role. Prefixed with `/api/shared`.*
### Global Notices (`/notices/global`)
- `GET /`: View global notices.
### Student Attendance (`/classes/:classId/students/:studentId/attendance`)
- `GET /`: View specific student's attendance in a class.
### Class Schedule (`/classes/:classId/schedule`)
- `GET /`: View class schedule.
### Class Events (`/classes/:classId/events`)
- `GET /`: View events for a class.
### Class Routine (`/classes/:classId/routine`)
- `GET /`: View (metadata of) the routine PDF for a class. **Actual file access STUBBED.**

## 6. User Profile Picture Upload (`/me/profile-picture`)
*Requires Authenticated User Role. Prefixed with `/api/me`.*
### POST /profile-picture
- **Description**: Authenticated user uploads/updates their own profile picture.
- **Request**: Multipart form data, field `profile_picture`.
- **Success Response (200 OK)**: `{"message": "...", "picture_url": "dummy_url"}`.
- **Note**: Actual file storage is **STUBBED**. DB `picture_url` is updated with a dummy URL.

## 7. Global Search (`/search`)
*Requires Authenticated User Role. Prefixed with `/api`.*
### GET /search
- **Description**: Global search across Users, Courses, Classes, etc.
- **Query Parameters**: `q` (string, required): Search term.
- **Success Response (200 OK or 207 Multi-Status)**: `models.SearchResults`.
