# Active Context - CUET ClassNectar

## Current Focus
**Transitioning to Pocketbase Backend & Initial Setup**
- Memory bank updated to reflect Pocketbase as the backend solution.
- Preparing for Pocketbase installation and schema definition.
- Revising frontend integration strategy for Pocketbase API/SDK.

## Immediate Priorities
1.  **Pocketbase Setup & Configuration:**
    *   Install Pocketbase locally.
    *   Define collections (schema) for users, departments, courses, classes, notices based on `projectbrief.md`.
    *   Configure access rules and permissions for collections.
2.  **Frontend Integration with Pocketbase:**
    *   Install Pocketbase JavaScript SDK in the frontend project (`npm install pocketbase`).
    *   Create a Pocketbase service wrapper in `src/lib/pocketbase.ts` or `src/api/pocketbase.ts` to initialize and manage the SDK client.
    *   Update authentication flow (AuthContext, signup/login pages) to use Pocketbase authentication.
3.  **Core UI Component Development (Continued):**
    *   Continue implementing key UI components with ShadCN.
    *   Ensure components are adaptable for data from Pocketbase.

## Current Constraints
- **Backend Shift:** Development on the Golang backend is halted; focus is now on Pocketbase.
- **API Integration:** No real backend connection yet; will be established with Pocketbase.
- **State Management:** Existing frontend state management will need to be adapted for Pocketbase auth state.

## Technical Considerations
1.  Project is adapting to a new backend (Pocketbase).
2.  All data persistence and business logic will be handled by Pocketbase.
3.  Frontend will interact with Pocketbase using its JS SDK.

## Key Decisions
1.  **Backend Technology Shift:** Pocketbase adopted for backend, database, and authentication.
2.  Frontend stack (React, TypeScript, Vite, ShadCN) remains unchanged.
3.  Initial focus on setting up Pocketbase and integrating authentication.

## Pending Implementation Tasks
1.  Install Pocketbase and run the server.
2.  Define all required collections in Pocketbase Admin UI.
3.  Set up Pocketbase JS SDK in the frontend.
4.  Implement user registration and login pages using Pocketbase.

## Risk Assessment
| Risk                                      | Impact | Mitigation                                                                 |
|-------------------------------------------|--------|----------------------------------------------------------------------------|
| Learning curve for Pocketbase             | Low-Med| Utilize official documentation, community resources.                       |
| Limitations of Pocketbase for complex logic | Medium | Evaluate as features are built; consider extending with Go if necessary (later). |
| Data migration if switching from Pocketbase | Medium | Plan for data export/import if a future switch to Supabase occurs.         |

## Decision Log
**Date:** (Today's Date)  
**Decision:** Switch backend from Golang/Supabase to Pocketbase.  
**Rationale:** User directive for a potentially simpler/faster initial setup for backend, auth, and database, with the option to change later.