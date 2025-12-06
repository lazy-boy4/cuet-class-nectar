import axios from 'axios';
import { Notice } from '@/types'; // Ensure types are defined or inferred

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// Fetch notices refined for the student (Global + Dept + Class)
export const fetchStudentNotices = async (): Promise<Notice[]> => {
    try {
        const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
        if (!accessToken) throw new Error("No access token found");

        const response = await axios.get(`${API_BASE_URL}/api/student/notices`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        // Map backend snake_case to frontend camelCase if necessary, 
        // or ensure frontend uses snake_case keys or interface matches.
        // Looking at NoticeBoard.tsx, it uses: title, createdAt, isGlobal, className, authorName, content, id.
        // Backend returns: id, class_id, dept_code, content, author_id, created_at, updated_at, author_name.
        // We need to MAP this.

        return response.data.map((n: any): Notice => ({
            id: n.id,
            title: n.title || n.content.substring(0, 50) + (n.content.length > 50 ? "..." : ""), // Generate title from content if missing
            content: n.content,
            createdAt: n.created_at,
            isGlobal: !n.class_id && !n.dept_code,
            className: n.class_code, // Ideally backend should join this. Wait, GetRelevantNotices selects *.
            // To get class_code (e.g. "CSE-21"), we need a Join.
            // Current 'GetRelevantNotices' does Select("*").
            // It won't have class names or author names unless we Join.
            // I should update backend service to use a View or Join.
            // OR I can live with IDs/Codes for now.
            // Frontend 'className' is optional.
            authorName: n.author_name || "Admin",
            classId: n.class_id,
            deptCode: n.dept_code,
        }));
    } catch (error) {
        console.error("Error fetching notices:", error);
        throw error;
    }
};
