
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

        // Update localStorage with fresh data
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

  // Get classes assigned to current teacher (for now using mock data for classes)
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

  return (
    <DashboardLayout
      title={`Welcome, ${currentUser?.full_name || "Teacher"}`}
      description="Manage your classes and track student progress"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-1 space-y-6 md:col-span-2">
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-white">Your Classes</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {assignedClasses.length === 0 ? (
                <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <BookOpen className="mb-2 h-12 w-12 text-white/30" />
                    <p className="text-lg text-white">No assigned classes</p>
                    <p className="text-sm text-white/70">
                      Contact admin to get classes assigned.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                assignedClasses.map((cls) => (
                  <Card
                    key={cls.id}
                    className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all duration-300"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white">
                        {cls.courseCode}: {cls.courseName}
                      </CardTitle>
                      <CardDescription>
                        Section {cls.section} • {cls.session}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-white/70 mb-2">
                        Department: {cls.departmentCode}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                          {cls.session}
                        </Badge>
                        <Badge variant="outline" className="bg-green-500/10 text-green-400">
                          Section {cls.section}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                        className="w-full"
                      >
                        <FileText className="mr-1 h-4 w-4" /> Manage Class
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-white">Quick Stats</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-blue-400 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-white">{assignedClasses.length}</p>
                      <p className="text-sm text-white/70">Total Classes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-400 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-white">
                        {assignedClasses.length * 45}
                      </p>
                      <p className="text-sm text-white/70">Est. Students</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Bell className="h-8 w-8 text-orange-400 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-white">{recentNotices.length}</p>
                      <p className="text-sm text-white/70">Recent Notices</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                  onClick={() => navigate("/teacher/profile")}
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
                  onClick={() => navigate("/teacher/attendance")}
                >
                  <CheckSquare className="mr-3 h-5 w-5 text-green-400" />
                  <div>
                    <span className="block text-sm font-medium text-white">
                      Take Attendance
                    </span>
                    <span className="text-xs text-white/70">
                      Mark student attendance
                    </span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className="flex h-auto items-center justify-start rounded-none px-4 py-3 text-left hover:bg-white/10"
                  onClick={() => window.open("/lovable-uploads/3fcc6e15-16d0-4bdb-8051-bd5314406f6c.png", "_blank")}
                >
                  <Clock className="mr-3 h-5 w-5 text-purple-400" />
                  <div>
                    <span className="block text-sm font-medium text-white">
                      Class Schedule
                    </span>
                    <span className="text-xs text-white/70">
                      View your teaching schedule
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
                </div>
              ) : (
                <div className="grid grid-cols-1 divide-y divide-white/10">
                  {recentNotices.map((notice) => (
                    <div key={notice.id} className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-white">{notice.title}</h4>
                        <span className="text-xs text-white/60">{formatDate(notice.createdAt)}</span>
                      </div>
                      <Badge variant="outline" className="mb-2 bg-blue-500/10 text-blue-400">
                        Global
                      </Badge>
                      <p className="mb-2 line-clamp-2 text-sm text-white/70">{notice.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 p-0 text-xs text-blue-400 hover:text-blue-300"
                        asChild
                      >
                        <Link to="/notices">Read more</Link>
                      </Button>
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

export default TeacherDashboard;
