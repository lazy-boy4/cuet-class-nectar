
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";

// Admin routes
import DepartmentManagement from "./pages/admin/DepartmentManagement";
import CourseManagement from "./pages/admin/CourseManagement";
import ClassManagement from "./pages/admin/ClassManagement";
import UserManagement from "./pages/admin/UserManagement";
import BulkUpload from "./pages/admin/BulkUpload";
import AssignTeachers from "./pages/admin/AssignTeachers";
import PromoteCRs from "./pages/admin/PromoteCRs";
import AdminDashboardPage from "./pages/admin/AdminDashboard";

// Teacher routes
import TeacherClassManagement from "./pages/teacher/ClassManagement";

// Student routes
import StudentProfile from "./pages/student/Profile";
import Enroll from "./pages/student/Enroll";
import ClassDetails from "./pages/student/ClassDetails";

// Shared routes
import NoticeBoard from "./pages/NoticeBoard";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/notices" element={<NoticeBoard />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Student routes */}
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/enroll" element={<Enroll />} />
            <Route path="/student/classes/:classId" element={<ClassDetails />} />
            
            {/* Teacher routes */}
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/classes/:classId" element={<TeacherClassManagement />} />
            
            {/* Admin routes */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/departments" element={<DepartmentManagement />} />
            <Route path="/admin/courses" element={<CourseManagement />} />
            <Route path="/admin/classes" element={<ClassManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/bulk-upload" element={<BulkUpload />} />
            <Route path="/admin/assign-teachers" element={<AssignTeachers />} />
            <Route path="/admin/promote-crs" element={<PromoteCRs />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
