# Current Development Context - CUET ClassNectar

## Status: Backend - Global Search Feature Implementation Complete

The backend API for the Global Search feature has been implemented. This includes the service logic to query multiple entities, the API handler, and the route.

## Recently Completed
- ✅ **Global Search Backend**:
    - Defined searchable entities and fields.
    - Designed a common search result structure.
    - Implemented `GlobalSearch` service (queries Users, Courses, Classes, Departments, Notices, Class Events using ILIKE).
    - Created `GlobalSearchHandler`.
    - Added `GET /api/search` route.
- ✅ RLS Policy Generation (from previous phase).
- ✅ Core Admin, Teacher, Student, CR features (from previous phase).

## Current Focus: Finalizing Global Search Implementation
- **Current Task**: Updating API documentation and Memory Bank files (`progress.md`, `activeContext.md`) to include the new Global Search feature.
  - `progress.md` has been updated.
  - `activeContext.md` is being updated now.

## Next Immediate Steps
1.  **Write Unit Test Structures for Search Service**.
2.  **Update Manual Testing Guide** to include scenarios for the Global Search API.
3.  **Submit Global Search Feature** implementation.

## Following Global Search Completion (Overall Project Next Steps):
1.  **Implement File Uploads (Revisit/Workaround)**:
    *   CR PDF Routine Uploads.
    *   Profile Picture Uploads (attempt to make actual storage work).
    *   Investigate alternatives if `nedpals/supabase-go` storage client remains problematic.
2.  **Apply and Test RLS Policies**:
    *   User (manual step) to apply the generated `rls_policies.sql`.
    *   Backend developer to assist in API-based testing of RLS.
3.  **Backend API Testing (Full Execution)**:
    *   Flesh out and run unit tests (requires mocking strategy).
    *   Execute comprehensive integration testing based on the manual guide.
4.  **Frontend Integration Support**.
5.  **Final Review and Submission of Project Phase**.

## Key Considerations & Challenges (Ongoing)
- **Supabase Go Library (`nedpals/supabase-go@v0.5.0`) Limitations**:
    - Admin Auth operations for `auth.users` are not supported.
    - Storage API issues led to stubbed file uploads.
    - Query ordering issues.
- **Manual RLS Application & Testing**: Requires user action.
