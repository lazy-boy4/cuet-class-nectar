import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  PieChart as PieChartIcon,
  BookOpen,
  CalendarDays,
  Bell,
  User,
  List,
  FileText,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchStudentDashboard } from "@/api/student"; // Use the new function
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  dept_code: string;
  role: string;
  student_id?: string;
  batch?: string;
  section?: string;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Combine all fetches into one via the dashboard endpoint
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useQuery({
    queryKey: ["studentDashboard"],
    queryFn: fetchStudentDashboard,
    retry: 1,
  });

  useEffect(() => {
    document.title = "Student Dashboard - CUET Class Management System";

    const checkAuth = () => {
      const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

      if (!accessToken || !userRole || (userRole !== "student" && userRole !== "cr")) {
        navigate("/login");
        return;
      }

      // We can optionally fetch full profile here if needed, or rely on dashboard data if it included user info
      // For now, let's keep the user profile fetch separate or minimal if needed, 
      // but `dashboard_service` doesn't return User Object. 
      // So we keep the profile fetch logic or rely on what we have.
      // Let's keep the existing profile fetch for specific user details like name/dept.
    };
    checkAuth();
  }, [navigate]);

  // Fetch full profile for the Welcome message and user details
  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      if (!accessToken) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const profileData: UserProfile = await response.json();
          setCurrentUser(profileData);
          // Update localStorage with fresh data
          const storage = localStorage.getItem("access_token") ? localStorage : sessionStorage;
          storage.setItem("userProfile", JSON.stringify({
            name: profileData.full_name,
            picture: "", // We might want to fix this to use the real pictureURL if available
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchUserProfile();
  }, []);

  if (dashboardError) {
    // toast({ title: "Error", description: "Failed to load dashboard data", variant: "destructive" });
  }

  const enrolledClasses = dashboardData?.enrolled_classes || [];
  const recentNotices = dashboardData?.recent_notices || [];
  const attendanceStatsData = dashboardData?.attendance_stats || { total_classes: 0, total_attended: 0, overall_percentage: 0 };

  // Calculate stats for Pie Chart
  // Backend returns total and attended. We can infer absent/late roughly or just show Present vs Absent
  // If backend only gives overall stats, we'll simplify the chart.
  // The backend struct: { TotalClasses, TotalAttended, OverallPercentage }
  const presentCount = attendanceStatsData.total_attended;
  const absentCount = attendanceStatsData.total_classes - attendanceStatsData.total_attended;

  const pieData = [
    { name: "Present/Late", value: presentCount, color: "#10b981" },
    { name: "Absent", value: absentCount, color: "#ef4444" },
  ].filter(item => item.value > 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <DashboardLayout
      title={`Welcome, ${currentUser?.full_name || "Student"}`}
      description="View your academic progress and class information"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-1 space-y-6 md:col-span-2">
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-white">Enrolled Classes</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {isDashboardLoading ? (
                <p className="text-white/50">Loading classes...</p>
              ) : enrolledClasses.length === 0 ? (
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <BookOpen className="mb-2 h-12 w-12 text-white/30" />
                    <p className="text-lg text-white">No enrolled classes</p>
                    <p className="text-sm text-white/70">
                      You haven't enrolled in any classes yet.
                    </p>
                    <Button
                      onClick={() => navigate("/student/enroll")}
                      className="mt-4 bg-gradient-to-r from-blue-600 to-blue-800"
                    >
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                enrolledClasses.map((cls: any) => (
                  <Card
                    key={cls.id}
                    className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all duration-300"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">
                        {cls.code}: {cls.session}
                      </CardTitle>
                      <CardDescription>
                        Section {cls.section}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-white/70">
                        Department: {cls.department_name || cls.dept_id}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/student/classes/${cls.id}`)}
                      >
                        <FileText className="mr-1 h-4 w-4" /> View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </section>

          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-white">Attendance Overview</h2>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3">
                  <div className="flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="inline-flex h-32 w-32 items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={50}
                              paddingAngle={2}
                              dataKey="value"
                              label
                            >
                              {pieData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="mt-2 text-2xl font-bold text-white">
                        {Math.round(attendanceStatsData.overall_percentage || 0)}%
                      </p>
                      <p className="text-sm text-white/70">Overall Attendance</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-green-500/10 p-3 text-center">
                        <p className="text-2xl font-bold text-green-400">
                          {presentCount}
                        </p>
                        <p className="text-sm text-green-400/80">Present/Late</p>
                      </div>
                      <div className="rounded-lg bg-red-500/10 p-3 text-center">
                        <p className="text-2xl font-bold text-red-400">
                          {absentCount}
                        </p>
                        <p className="text-sm text-red-400/80">Absent</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm text-white/70">
                        Total Classes: <span className="text-white">{attendanceStatsData.total_classes}</span>
                      </p>

                      <div className="mt-3">
                        {attendanceStatsData.total_classes === 0 ? (
                          <p className="text-white/70">
                            No attendance records found.
                          </p>
                        ) : attendanceStatsData.overall_percentage < 75 ? (
                          <div className="rounded-md bg-red-500/10 p-2 text-sm text-red-400">
                            Your attendance is below the required 75%. Please improve your attendance.
                          </div>
                        ) : (
                          <div className="rounded-md bg-green-500/10 p-2 text-sm text-green-400">
                            Your attendance is above the required 75%. Keep it up!
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="col-span-1 space-y-6">
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-white">Quick Actions</h2>
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-white/10">
                <Button
                  variant="ghost"
                  className="flex h-auto items-center justify-start rounded-none px-4 py-3 text-left hover:bg-white/10"
                  onClick={() => navigate("/student/profile")}
                >
                  <User className="mr-3 h-5 w-5 text-blue-400" />
                  <div>
                    <span className="block text-sm font-medium text-white">
                      Profile
                    </span>
                    <span className="text-xs text-white/70">
                      View and edit your profile
                    </span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="flex h-auto items-center justify-start rounded-none px-4 py-3 text-left hover:bg-white/10"
                  onClick={() => navigate("/student/enroll")}
                >
                  <List className="mr-3 h-5 w-5 text-purple-400" />
                  <div>
                    <span className="block text-sm font-medium text-white">
                      Enroll in Classes
                    </span>
                    <span className="text-xs text-white/70">
                      Register for new classes
                    </span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="flex h-auto items-center justify-start rounded-none px-4 py-3 text-left hover:bg-white/10"
                  onClick={() => navigate("/notices")}
                >
                  <Bell className="mr-3 h-5 w-5 text-orange-400" />
                  <div>
                    <span className="block text-sm font-medium text-white">
                      Notice Board
                    </span>
                    <span className="text-xs text-white/70">
                      View all announcements
                    </span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="flex h-auto items-center justify-start rounded-none px-4 py-3 text-left hover:bg-white/10"
                  onClick={() => navigate("/student/schedule")}
                >
                  <Clock className="mr-3 h-5 w-5 text-green-400" />
                  <div>
                    <span className="block text-sm font-medium text-white">
                      View Class Schedule
                    </span>
                    <span className="text-xs text-white/70">
                      See your weekly class schedule
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </section>

          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-white">Recent Notices</h2>
            <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              {recentNotices.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6">
                  <Bell className="mb-2 h-8 w-8 text-white/30" />
                  <p className="text-sm text-white/70">No notices available</p>
                  {isDashboardLoading && <p className="text-xs text-white/50">Loading matches...</p>}
                </div>
              ) : (
                <div className="grid grid-cols-1 divide-y divide-white/10">
                  {recentNotices.map((notice: any) => (
                    <div key={notice.id} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white">{notice.content}</h4>
                        <span className="text-xs text-white/60">{formatDate(notice.created_at)}</span>
                      </div>
                      {/* Note: notice object from backend might summary content in 'content' field and full title/content might differ. 
                           The dashboard notice structure is simple: id, content, created_at, class_code 
                           We can determine type by checking class_code */}
                      {notice.class_code ? (
                        <Badge variant="outline" className="mb-2 bg-green-500/10 text-green-400">
                          {notice.class_code}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="mb-2 bg-blue-500/10 text-blue-400">
                          Global
                        </Badge>
                      )}

                      <p className="mb-2 line-clamp-2 text-sm text-white/70">{notice.content}</p>
                      {/* Read more link could go to /notices */}
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-white/10 p-4">
                <Button
                  variant="ghost"
                  className="w-full hover:bg-white/10"
                  onClick={() => navigate("/notices")}
                >
                  View All Notices
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
