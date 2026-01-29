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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuProgress } from "@/components/ui/neu-progress";
import { GlowBadge } from "@/components/ui/glow-badge";
import { StatDisplay } from "@/components/ui/stat-display";
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
  const lateCount = 2;

  const pieData = [
    { name: "Present", value: presentCount || 42, color: "hsl(142, 76%, 36%)" },
    { name: "Absent", value: absentCount || 6, color: "hsl(0, 84%, 60%)" },
    { name: "Late", value: lateCount, color: "hsl(45, 93%, 47%)" },
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

  const mockEnrolledClasses = enrolledClasses.length > 0 ? enrolledClasses : [
    { id: "1", code: "CSE 301", name: "Advanced Algorithms", session: "2023-24", section: "A", attendance: 75 },
    { id: "2", code: "EEE 202", name: "Circuit Analysis II", session: "2023-24", section: "B", attendance: 50 },
  ];

  const mockNotices = recentNotices.length > 0 ? recentNotices : [
    { id: "1", title: "Exam Schedule Released", content: "Final exam schedule has been published", created_at: "2024-01-20", type: "exam" },
    { id: "2", title: "Holiday Announcement", content: "Campus will be closed for spring break", created_at: "2024-01-18", type: "holiday" },
    { id: "3", title: "System Maintenance", content: "Scheduled maintenance on Sunday", created_at: "2024-01-15", type: "system" },
  ];

  const quickActions = [
    { title: "Profile", icon: User, color: "bg-info/10 text-info", route: "/student/profile" },
    { title: "Enroll", icon: List, color: "bg-icon-purple/10 text-icon-purple", route: "/student/enroll" },
    { title: "Notices", icon: Bell, color: "bg-icon-orange/10 text-icon-orange", route: "/notices" },
    { title: "Schedule", icon: Clock, color: "bg-success/10 text-success", route: "/student/schedule" },
    { title: "Classrooms", icon: Users, color: "bg-icon-teal/10 text-icon-teal", route: "/student/classrooms" },
    { title: "Create", icon: Plus, color: "bg-info/10 text-info", route: "/student/classrooms/create" },
  ];

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case "exam": return <Bell className="h-5 w-5 text-icon-orange" />;
      case "holiday": return <Calendar className="h-5 w-5 text-success" />;
      case "system": return <Megaphone className="h-5 w-5 text-icon-purple" />;
      default: return <FileText className="h-5 w-5 text-info" />;
    }
  };

  return (
    <DashboardLayout
      title={`Welcome, ${currentUser?.full_name || "Student"}`}
      description="View your academic progress and class information"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Enrolled Classes */}
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Enrolled Classes</h2>
            <div className="space-y-4">
              {isDashboardLoading ? (
                <NeuCard variant="raised" className="p-6">
                  <div className="animate-pulse-soft text-muted-foreground">Loading classes...</div>
                </NeuCard>
              ) : mockEnrolledClasses.length === 0 ? (
                <NeuCard variant="raised" className="p-8">
                  <NeuCardContent className="p-0 flex flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-luxe-black shadow-neu-inset">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground">No enrolled classes</p>
                    <p className="text-sm text-muted-foreground mb-4">You haven't enrolled in any classes yet.</p>
                    <NeuButton variant="primary" onClick={() => navigate("/student/enroll")}>
                      Enroll Now
                    </NeuButton>
                  </NeuCardContent>
                </NeuCard>
              ) : (
                mockEnrolledClasses.map((cls: any) => (
                  <NeuCard key={cls.id} variant="raised" hover className="p-5">
                    <NeuCardContent className="p-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-luxe-black shadow-neu-inset">
                            <BookOpen className="h-6 w-6 text-success" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {cls.code}: {cls.name || cls.session}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Section {cls.section}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right w-40">
                            <p className="text-sm font-medium text-foreground mb-2">
                              Attendance: {cls.attendance || 75}%
                            </p>
                            <NeuProgress 
                              value={cls.attendance || 75} 
                              variant={cls.attendance >= 75 ? "success" : cls.attendance >= 50 ? "warning" : "destructive"}
                              className="h-2"
                            />
                          </div>
                          <NeuButton
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/student/classes/${cls.id}`)}
                          >
                            View
                          </NeuButton>
                        </div>
                      </div>
                    </NeuCardContent>
                  </NeuCard>
                ))
              )}
            </div>
          </section>

          {/* Attendance Overview */}
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Attendance Overview</h2>
            <NeuCard variant="raised" className="p-6">
              <NeuCardContent className="p-0">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                  {/* Donut Chart */}
                  <div className="relative flex h-48 w-48 items-center justify-center flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
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
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Overall</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-1 flex-wrap justify-center gap-4">
                    <StatDisplay value={presentCount || 42} label="Present" variant="success" />
                    <StatDisplay value={absentCount || 6} label="Absent" variant="destructive" />
                    <StatDisplay value={lateCount} label="Late" variant="warning" />
                  </div>
                </div>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Total Classes: {totalClasses}
                </p>
              </NeuCardContent>
            </NeuCard>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <NeuCard
                  key={action.title}
                  variant="raised"
                  hover
                  className="p-4"
                  onClick={() => navigate(action.route)}
                >
                  <NeuCardContent className="p-0 flex flex-col items-start">
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${action.color}`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{action.title}</span>
                  </NeuCardContent>
                </NeuCard>
              ))}
            </div>
          </section>

          {/* Recent Notices */}
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Recent Notices</h2>
            <NeuCard variant="raised" className="overflow-hidden">
              <NeuCardContent className="p-0">
                {mockNotices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Bell className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No notices available</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.06]">
                    {mockNotices.slice(0, 3).map((notice: any) => (
                      <div 
                        key={notice.id} 
                        className="flex items-start gap-4 p-4 transition-colors hover:bg-secondary/50 cursor-pointer"
                        onClick={() => navigate("/notices")}
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-luxe-black shadow-neu-inset">
                          {getNoticeIcon(notice.type || "default")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground truncate">{notice.title}</h4>
                          <p className="text-sm text-muted-foreground truncate">{notice.content}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(notice.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-t border-white/[0.06] p-4">
                  <NeuButton
                    variant="ghost"
                    className="w-full text-info hover:text-info/80"
                    onClick={() => navigate("/notices")}
                  >
                    View All Notices
                  </NeuButton>
                </div>
              </NeuCardContent>
            </NeuCard>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
