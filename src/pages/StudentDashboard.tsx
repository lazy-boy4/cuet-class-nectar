import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Bell,
  User,
  List,
  Clock,
  FileText,
  Megaphone,
  Calendar,
  Users,
  Plus,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fetchStudentDashboard } from "@/api/student";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
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
    };
    checkAuth();
  }, [navigate]);

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
          const storage = localStorage.getItem("access_token") ? localStorage : sessionStorage;
          storage.setItem("userProfile", JSON.stringify({
            name: profileData.full_name,
            picture: "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchUserProfile();
  }, []);

  const enrolledClasses = dashboardData?.enrolled_classes || [];
  const recentNotices = dashboardData?.recent_notices || [];
  const attendanceStatsData = dashboardData?.attendance_stats || { total_classes: 0, total_attended: 0, overall_percentage: 0 };

  const presentCount = attendanceStatsData.total_attended;
  const absentCount = attendanceStatsData.total_classes - attendanceStatsData.total_attended;
  const lateCount = 2; // Mock late count for demo

  const pieData = [
    { name: "Present", value: presentCount || 42, color: "hsl(var(--chart-present))" },
    { name: "Absent", value: absentCount || 6, color: "hsl(var(--chart-absent))" },
    { name: "Late", value: lateCount, color: "hsl(var(--chart-late))" },
  ].filter(item => item.value > 0);

  const totalClasses = attendanceStatsData.total_classes || 50;
  const overallPercentage = attendanceStatsData.overall_percentage || 88;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Mock enrolled classes for design
  const mockEnrolledClasses = enrolledClasses.length > 0 ? enrolledClasses : [
    { id: "1", code: "CSE 301", name: "Advanced Algorithms", session: "2023-24", section: "A", attendance: 75 },
    { id: "2", code: "EEE 202", name: "Circuit Analysis II", session: "2023-24", section: "B", attendance: 50 },
  ];

  // Mock notices for design
  const mockNotices = recentNotices.length > 0 ? recentNotices : [
    { id: "1", title: "Exam Schedule Released", content: "Exam Schedule Released", created_at: "2023-09-31", type: "exam" },
    { id: "2", title: "Holiday Announcement", content: "Holiday Announcement", created_at: "2023-03-23", type: "holiday" },
    { id: "3", title: "System Maintenance Update", content: "System Maintenance Update", created_at: "2023-04-19", type: "system" },
  ];

  const quickActions = [
    { title: "Profile Settings", icon: User, color: "bg-icon-blue/10 text-icon-blue", route: "/student/profile" },
    { title: "Enroll in Classes", icon: List, color: "bg-icon-purple/10 text-icon-purple", route: "/student/enroll" },
    { title: "Notice Board", icon: Bell, color: "bg-icon-orange/10 text-icon-orange", route: "/notices" },
    { title: "Class Schedule", icon: Clock, color: "bg-icon-green/10 text-icon-green", route: "/student/schedule" },
    { title: "My Classrooms", icon: Users, color: "bg-icon-teal/10 text-icon-teal", route: "/student/classrooms" },
    { title: "Create Classroom", icon: Plus, color: "bg-icon-blue/10 text-icon-blue", route: "/student/classrooms/create" },
  ];

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case "exam": return <Bell className="h-5 w-5 text-icon-orange" />;
      case "holiday": return <Calendar className="h-5 w-5 text-icon-green" />;
      case "system": return <Megaphone className="h-5 w-5 text-icon-purple" />;
      default: return <FileText className="h-5 w-5 text-icon-blue" />;
    }
  };

  return (
    <DashboardLayout
      title={`Welcome, ${currentUser?.full_name || "Student"}`}
      description="View your academic progress and class information"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Enrolled Classes & Attendance */}
        <div className="space-y-8 lg:col-span-2">
          {/* Enrolled Classes Section */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Enrolled Classes</h2>
            <div className="space-y-4">
              {isDashboardLoading ? (
                <Card className="border-border bg-secondary/50">
                  <CardContent className="p-6">
                    <p className="text-muted-foreground">Loading classes...</p>
                  </CardContent>
                </Card>
              ) : mockEnrolledClasses.length === 0 ? (
                <Card className="border-border bg-secondary/50">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <BookOpen className="mb-3 h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium text-foreground">No enrolled classes</p>
                    <p className="text-sm text-muted-foreground">You haven't enrolled in any classes yet.</p>
                    <Button
                      onClick={() => navigate("/student/enroll")}
                      className="mt-4 bg-cuet-blue hover:bg-cuet-blue/90"
                    >
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                mockEnrolledClasses.map((cls: any) => (
                  <Card key={cls.id} className="border-border bg-secondary/50 transition-all hover:bg-secondary/70">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-icon-green/10">
                            <BookOpen className="h-6 w-6 text-icon-green" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {cls.code}: {cls.name || cls.session}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {cls.name ? `Active in any classes` : `Section ${cls.section}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              Attendance ({cls.attendance || 75}%)
                            </p>
                            <Progress 
                              value={cls.attendance || 75} 
                              className="mt-1 h-2 w-32 bg-muted"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/student/classes/${cls.id}`)}
                            className="border-border bg-cuet-blue/10 text-cuet-blue hover:bg-cuet-blue/20"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          {/* Attendance Overview Section */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Attendance Overview</h2>
            <Card className="border-border bg-secondary/50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                  {/* Donut Chart */}
                  <div className="relative flex h-48 w-48 items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={2}
                          dataKey="value"
                          strokeWidth={0}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-foreground">{overallPercentage}%</span>
                      <span className="text-sm text-muted-foreground">Overall Attendance</span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="flex flex-1 flex-wrap justify-center gap-4">
                    <div className="flex min-w-[120px] flex-col items-center rounded-xl bg-success/10 px-6 py-4">
                      <span className="text-3xl font-bold text-success">{presentCount || 42}</span>
                      <span className="text-sm text-success/80">Present: {presentCount || 42}</span>
                    </div>
                    <div className="flex min-w-[120px] flex-col items-center rounded-xl bg-destructive/10 px-6 py-4">
                      <span className="text-3xl font-bold text-destructive">{absentCount || 6}</span>
                      <span className="text-sm text-destructive/80">Absent: {absentCount || 6}</span>
                    </div>
                    <div className="flex min-w-[120px] flex-col items-center rounded-xl bg-warning/10 px-6 py-4">
                      <span className="text-3xl font-bold text-warning">{lateCount}</span>
                      <span className="text-sm text-warning/80">Late: {lateCount}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Total Classes: {totalClasses}
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Right Column - Quick Actions & Recent Notices */}
        <div className="space-y-8">
          {/* Quick Actions Section */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Card
                  key={action.title}
                  className="cursor-pointer border-border bg-secondary/50 transition-all hover:bg-secondary/70 hover:shadow-md"
                  onClick={() => navigate(action.route)}
                >
                  <CardContent className="flex flex-col items-start p-5">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{action.title}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Notices Section */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">Recent Notices</h2>
            <Card className="border-border bg-secondary/50">
              <CardContent className="p-0">
                {mockNotices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Bell className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No notices available</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {mockNotices.slice(0, 3).map((notice: any) => (
                      <div key={notice.id} className="flex items-start gap-4 p-4 transition-colors hover:bg-secondary/70">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          {getNoticeIcon(notice.type || "default")}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{notice.title || notice.content}</h4>
                          <p className="text-sm text-muted-foreground">{notice.content}</p>
                        </div>
                        <span className="whitespace-nowrap text-xs text-muted-foreground">
                          {formatDate(notice.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-border p-4">
                  <Button
                    variant="link"
                    className="w-full text-cuet-blue hover:text-cuet-blue/80"
                    onClick={() => navigate("/notices")}
                  >
                    View All Notices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
