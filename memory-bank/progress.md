# Project Progress - CUET ClassNectar

## Current Status (Backend Development Phase 2 Ongoing)
- **Frontend**: Previously reported as complete. Awaiting backend integration.
- **Backend API**: Core features implemented, including Global Search. File upload APIs are structurally complete but actual storage is STUBBED.
  - Role-based access control is in place.
  - CRUD operations for key entities are functional.
- **Database**: Schema setup assumed. RLS policy script generated (pending manual application).
- **File Uploads**: API endpoints for profile pictures and CR PDF routines are implemented. Database metadata is stored. **Actual file interaction with Supabase Storage is STUBBED** due to library issues; dummy URLs are used.

## Backend Features Implemented
(Includes Admin, Teacher, Student, CR, Shared features, and Global Search as previously detailed)
... (Previous feature list remains largely the same, with file upload features now noted as having stubbed storage)

### ✅ File Uploads (API & DB Logic Complete, Storage STUBBED)
- **Profile Picture Upload**: Users can "upload" profile pictures. API updates `users.picture_url` with a dummy URL.
- **CR PDF Class Routine Upload**: CRs can "upload" PDF routines for their classes. API creates/updates `class_routines` metadata with a dummy URL. CRs can delete this metadata. Public can view metadata.

## Known Issues & Limitations
- **Actual File Storage**: **NOT FUNCTIONAL.** All file uploads (profile pictures, CR routines) currently use dummy URLs and do not interact with Supabase Storage due to persistent issues with the `nedpals/supabase-go` library's Storage API.
- **Admin Auth Operations**: `nedpals/supabase-go@v0.5.0` does not support admin creation/deletion of `auth.users`. Backend functions are stubbed.
- **Database Query Ordering**: The `.Order()` method for Supabase queries caused build issues. Ordering has been omitted from some list queries.
- **RLS Policies**: SQL script generated. Manual application and thorough testing are pending.
- **Comprehensive Testing**: Unit test structures generated. Full execution and more integration tests pending.
- **Frontend Integration**: Pending.

## Next Steps (Current Plan: File Uploads & Documentation)
1.  **Resolve File Upload to Supabase Storage.** (Attempt 1 with lib resulted in STUBS. Attempts 2/3 - direct HTTP or presigned URLs - are potential future investigations if stubs are insufficient).
2.  **Implement Profile Picture Uploads (Using Resolved STUBBED Method).** (Done)
3.  **Implement CR PDF Routine Uploads (Using Resolved STUBBED Method).** (Done)
4.  **Update Documentation and Memory Bank.** (In Progress - this task)
5.  **Write Unit Test Structures for File Uploads.**
6.  **Submit File Upload Implementation.**

## Overall Next Major Steps (Post File Uploads & Docs)
1.  **Apply and Test RLS Policies** (Manual step by user, then backend validation).
2.  **Backend API Testing (Full Execution)**.
3.  **Frontend Integration Support**.
4.  **Final Review and Submission of Project Phase**.

## Last Updated
- Date: [Current Date]
- Status: File upload APIs (profile pics, CR routines) implemented with STUBBED storage. Documentation being updated.
