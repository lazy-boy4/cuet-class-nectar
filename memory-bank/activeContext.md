# Current Development Context - CUET ClassNectar

## Status: Backend Phase 2 - File Uploads (Stubbed) & Documentation

Work on implementing file upload APIs (profile pictures, CR PDF routines) is complete. However, due to persistent issues with the `nedpals/supabase-go` Storage API, the actual file storage mechanism is **STUBBED**. The backend generates dummy URLs and updates database metadata accordingly, but no files are physically saved to Supabase Storage via these Go backend APIs.

## Recently Completed
- ✅ **Profile Picture Upload API**: Endpoint and DB update logic for user profile pictures (stubbed storage).
- ✅ **CR PDF Routine Upload API**: Endpoints for CRs to "upload", view metadata, and delete metadata for class routines (stubbed storage).
- ✅ Global Search Backend implementation.
- ✅ RLS Policy Generation script.
- ✅ Core Admin, Teacher, Student, CR features.

## Current Focus: Updating Documentation & Memory Bank for File Uploads
- **Current Task**: Updating API documentation and all Memory Bank files to reflect the implementation and stubbed nature of file uploads.
  - `API_DOCUMENTATION.md` updated.
  - `MANUAL_API_TESTING_GUIDE.md` updated.
  - `progress.md` updated.
  - `activeContext.md` being updated now.
  - `techContext.md` to be updated.

## Next Immediate Steps
1.  **Update `techContext.md`** regarding file upload stubbing.
2.  **Write Unit Test Structures for File Upload Services**.
3.  **Submit File Upload Implementation** (current phase of work).

## Following This (Overall Project Next Steps):
1.  **Apply and Test RLS Policies** (Manual step by user, then backend validation).
2.  **Backend API Testing (Full Execution)**: Flesh out and run unit tests, execute integration test plan.
3.  **Frontend Integration Support**.
4.  **Investigate File Storage Solutions**: If stubbed file uploads are insufficient, dedicate effort to finding a working solution for Supabase Storage (e.g., direct HTTP, presigned URLs, alternative library).
5.  **Final Review and Submission of Project Phase**.

## Key Considerations & Challenges (Ongoing)
- **File Storage Workaround**: The current stubbed file upload is a significant limitation.
- **Supabase Go Library (`nedpals/supabase-go@v0.5.0`) Limitations**: Admin Auth, Storage API, Query Ordering.
- **Manual RLS Application & Testing**: Requires user action.
