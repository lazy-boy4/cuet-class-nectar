
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Users,
  Calendar,
  Bell,
  User,
  FileText,
  CheckSquare,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { NeuCard, NeuCardContent, NeuCardHeader, NeuCardTitle, NeuCardDescription } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { GlowBadge } from "@/components/ui/glow-badge";
import { StatDisplay } from "@/components/ui/stat-display";
import { mockClasses } from "@/api/mockData/classes";
import { fetchNotices } from "@/api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  dept_code: string;
  role: string;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Teacher Dashboard - CUET Class Management System";

    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

      if (!accessToken || !userRole || userRole !== "teacher") {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const profileData: UserProfile = await response.json();
        setCurrentUser(profileData);

        const storage = localStorage.getItem("access_token") ? localStorage : sessionStorage;
        storage.setItem("userProfile", JSON.stringify({
          name: profileData.full_name,
          picture: "",
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try logging in again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate, toast]);

  const assignedClasses = mockClasses.filter(cls =>
    cls.teacherId === currentUser?.id || cls.teacherName === currentUser?.full_name
  );

  const { data: notices = [] } = useQuery({
    queryKey: ["teacherNotices"],
    queryFn: () => fetchNotices(),
    enabled: !!currentUser,
  });

  const recentNotices = notices
    .filter(notice => notice.isGlobal)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const quickActions = [
    { icon: User, title: "Profile", description: "View and edit your profile", color: "text-info", route: "/teacher/profile" },
    { icon: Bell, title: "Notice Board", description: "View all announcements", color: "text-icon-orange", route: "/notices" },
    { icon: CheckSquare, title: "Take Attendance", description: "Mark student attendance", color: "text-success", route: "/teacher/attendance" },
    { icon: Clock, title: "Class Schedule", description: "View your teaching schedule", color: "text-icon-purple", route: "#" },
  ];

  return (
    <DashboardLayout
      title={`Welcome, ${currentUser?.full_name || "Teacher"}`}
      description="Manage your classes and track student progress"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Your Classes */}
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Your Classes</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {assignedClasses.length === 0 ? (
                <NeuCard variant="raised" className="sm:col-span-2 p-8">
                  <NeuCardContent className="p-0 flex flex-col items-center justify-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-luxe-black shadow-neu-inset">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium text-foreground">No assigned classes</p>
                    <p className="text-sm text-muted-foreground">Contact admin to get classes assigned.</p>
                  </NeuCardContent>
                </NeuCard>
              ) : (
                assignedClasses.map((cls) => (
                  <NeuCard key={cls.id} variant="raised" hover className="p-5">
                    <NeuCardHeader className="p-0 pb-3">
                      <NeuCardTitle className="text-lg">
                        {cls.courseCode}: {cls.courseName}
                      </NeuCardTitle>
                      <NeuCardDescription>
                        Section {cls.section} • {cls.session}
                      </NeuCardDescription>
                    </NeuCardHeader>
                    <NeuCardContent className="p-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Department: {cls.departmentCode}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <GlowBadge variant="blue">{cls.session}</GlowBadge>
                        <GlowBadge variant="green">Section {cls.section}</GlowBadge>
                      </div>
                      <NeuButton
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                        className="w-full"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Manage Class
                      </NeuButton>
                    </NeuCardContent>
                  </NeuCard>
                ))
              )}
            </div>
          </section>

          {/* Quick Stats */}
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Stats</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <NeuCard variant="raised" className="p-5">
                <NeuCardContent className="p-0 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-luxe-black shadow-neu-inset">
                    <BookOpen className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{assignedClasses.length}</p>
                    <p className="text-sm text-muted-foreground">Total Classes</p>
                  </div>
                </NeuCardContent>
              </NeuCard>

              <NeuCard variant="raised" className="p-5">
                <NeuCardContent className="p-0 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-luxe-black shadow-neu-inset">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{assignedClasses.length * 45}</p>
                    <p className="text-sm text-muted-foreground">Est. Students</p>
                  </div>
                </NeuCardContent>
              </NeuCard>

              <NeuCard variant="raised" className="p-5">
                <NeuCardContent className="p-0 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-luxe-black shadow-neu-inset">
                    <Bell className="h-6 w-6 text-icon-orange" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{recentNotices.length}</p>
                    <p className="text-sm text-muted-foreground">Recent Notices</p>
                  </div>
                </NeuCardContent>
              </NeuCard>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Quick Actions</h2>
            <NeuCard variant="raised" className="overflow-hidden">
              <NeuCardContent className="p-0 divide-y divide-white/[0.06]">
                {quickActions.map((action) => (
                  <NeuButton
                    key={action.title}
                    variant="ghost"
                    className="flex h-auto w-full items-center justify-start rounded-none px-4 py-4 text-left hover:bg-secondary/50"
                    onClick={() => action.route !== "#" && navigate(action.route)}
                  >
                    <div className={`mr-4 flex h-10 w-10 items-center justify-center rounded-lg bg-luxe-black shadow-neu-inset`}>
                      <action.icon className={`h-5 w-5 ${action.color}`} />
                    </div>
                    <div>
                      <span className="block text-sm font-medium text-foreground">
                        {action.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    </div>
                  </NeuButton>
                ))}
              </NeuCardContent>
            </NeuCard>
          </section>

          {/* Recent Notices */}
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-foreground">Recent Notices</h2>
            <NeuCard variant="raised" className="overflow-hidden">
              <NeuCardContent className="p-0">
                {recentNotices.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <Bell className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No notices available</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.06]">
                    {recentNotices.map((notice) => (
                      <div key={notice.id} className="p-4 hover:bg-secondary/50 transition-colors">
                        <div className="mb-2 flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-foreground">{notice.title}</h4>
                          <span className="text-xs text-muted-foreground">{formatDate(notice.createdAt)}</span>
                        </div>
                        <GlowBadge variant="blue" size="sm" className="mb-2">Global</GlowBadge>
                        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{notice.content}</p>
                        <Link 
                          to="/notices" 
                          className="text-xs text-info hover:text-info/80 transition-colors"
                        >
                          Read more
                        </Link>
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

export default TeacherDashboard;
