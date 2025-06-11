# Project Progress - CUET ClassNectar

## Current Status (Backend Development Phase 2 Ongoing)
- **Frontend**: Previously reported as complete. Awaiting backend integration.
- **Backend API**: Core features implemented. Global Search added.
  - Role-based access control (Admin, Teacher, CR, Student) is in place with JWT authentication.
  - Most CRUD operations for key entities are functional.
  - Some limitations exist with the current Go Supabase library (`nedpals/supabase-go@v0.5.0`) affecting Admin Auth operations and File Storage.
- **Database**: Schema setup for core tables assumed to be in place in Supabase. RLS policy script generated, pending manual application and testing.

## Backend Features Implemented

### ✅ Core Backend & Authentication
- **Go Project Structure**: Setup with `cmd/server`, `internal/handlers`, `internal/services`, `internal/models`.
- **Supabase Integration**: Using `nedpals/supabase-go@v0.5.0` client.
- **Authentication**: Signup, Login, JWT Middleware.
- **Role-Specific Middleware**: AdminRequired, TeacherRequired, CRRequired.

### ✅ Admin Features (`/api/admin/...`)
- Department, Course, Class Management (CRUD).
- User Profile Management (List, Get, Update; Admin Auth Create/Delete STUBBED).
- Bulk Student Profile Upload (profiles only).
- Teacher-Class Assignments.
- Promote/Demote CRs.
- Global Notice Creation.

### ✅ Teacher Features (`/api/teacher/...`)
- Notice Management (for assigned classes).
- Attendance Management.
- Schedule Management (Structured).
- Teacher Dashboard data endpoint.

### ✅ Student & CR Features (`/api/student/...`)
- Student Dashboard data.
- Student Profile Management (self).
- Enrollment Management (Student: request, view status, list available; CR: review pending, list pending for class).
- Class Event Management (CR: CRUD for class events).

### ✅ Shared Features & Endpoints
- Global Notices (View for all authenticated).
- View Class Schedules, Class Events (for all authenticated).
- View own Attendance (Student).
- **Global Search (`GET /api/search?q=...`)**:
  - Searches across Users, Courses, Classes, Departments, Notices, Class Events.
  - Uses ILIKE for partial, case-insensitive matching.
  - Results respect RLS policies.
  - Basic result structure provided (`models.SearchResultItem`).

## Known Issues & Limitations
- **Admin Auth Operations**: `nedpals/supabase-go@v0.5.0` does not support admin creation/deletion of `auth.users`. Backend functions are stubbed.
- **File Uploads**: Profile picture uploads are stubbed (API exists, DB updates, but no actual file storage) due to `nedpals/supabase-go` Storage API issues. PDF routine uploads for CRs are not yet implemented and will face the same issue.
- **Database Query Ordering**: The `.Order()` method for Supabase queries caused build issues. Ordering has been omitted from some list queries (including Global Search results for now).
- **RLS Policies**: SQL script generated. Manual application and thorough testing are pending.
- **Comprehensive Testing**: Unit test structures generated. Full execution and more integration tests pending.
- **Frontend Integration**: Pending.

## Next Steps (Current Plan: Global Search Implementation)
1.  **Define Searchable Entities and Fields.** (Done)
2.  **Design Search Result Structure.** (Done)
3.  **Implement Search Service Logic.** (Done)
4.  **Create Search Handler.** (Done)
5.  **Add Search Route.** (Done)
6.  **Update API Documentation and Memory Bank.** (In Progress - this task)
7.  **Write Unit Test Structures for Search.**
8.  **Provide Manual Testing Guidance for Search.**
9.  **Final Submission for Global Search.**

## Overall Next Major Steps (Post Global Search)
1.  **Implement File Uploads (Revisit/Workaround)**: CR PDF Routines, Profile Pictures (actual storage).
2.  **Apply and Test RLS Policies** (Manual step by user, then backend validation).
3.  **Backend API Testing (Full Execution)**.
4.  **Frontend Integration Support**.
5.  **Final Review and Submission of Project Phase**.

## Last Updated
- Date: [Current Date - to be filled by Void/Jules]
- Status: Global Search feature backend implemented. Continuing with documentation and testing prep for search.
