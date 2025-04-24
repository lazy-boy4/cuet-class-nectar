
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { fetchEnrollments, fetchNotices, fetchAttendance } from "@/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { mockUsers } from "@/api/mockData/users";
import { mockClasses } from "@/api/mockData/classes";

// Define a type for the attendance stats
interface AttendanceStats {
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  useEffect(() => {
    document.title = "Student Dashboard - CUET Class Management System";
    
    // Check if user is authenticated
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "student") {
      navigate("/login");
      return;
    }
    
    // Get mock current user (in a real app, this would come from authentication)
    // Here we're just using a student from our mock data
    const student = mockUsers.find(u => u.role === "student");
    if (student) {
      setCurrentUser(student);
    }
  }, [navigate]);
  
  // Fetch enrolled classes for the current student
  const { data: enrollments = [] } = useQuery({
    queryKey: ["studentEnrollments", currentUser?.id],
    queryFn: () => fetchEnrollments(currentUser?.id),
    enabled: !!currentUser,
  });
  
  // Fetch notices
  const { data: notices = [] } = useQuery({
    queryKey: ["studentNotices"],
    queryFn: () => fetchNotices(),
    enabled: !!currentUser,
  });
  
  // Get enrolled class IDs
  const enrolledClassIds = enrollments
    .filter(e => e.status === "approved")
    .map(e => e.classId);
  
  // Get enrolled classes details
  const enrolledClasses = mockClasses.filter(c => 
    enrolledClassIds.includes(c.id)
  );
  
  // Fetch attendance for all enrolled classes
  const { data: attendanceData = [] } = useQuery({
    queryKey: ["studentAttendance", currentUser?.id, enrolledClassIds],
    queryFn: async () => {
      if (!currentUser || !enrolledClassIds.length) return [];
      
      const allAttendance = [];
      for (const classId of enrolledClassIds) {
        const classAttendance = await fetchAttendance(classId);
        allAttendance.push(...classAttendance.filter(a => a.studentId === currentUser.id));
      }
      return allAttendance;
    },
    enabled: !!currentUser && enrolledClassIds.length > 0,
  });
  
  // Calculate attendance stats
  const calculateAttendanceStats = (): AttendanceStats => {
    const present = attendanceData.filter(a => a.status === "present").length;
    const absent = attendanceData.filter(a => a.status === "absent").length;
    const late = attendanceData.filter(a => a.status === "late").length;
    const total = present + absent + late;
    
    return {
      present,
      absent,
      late,
      total,
      percentage: total > 0 ? Math.round((present + late * 0.5) / total * 100) : 0
    };
  };
  
  const attendanceStats = calculateAttendanceStats();
  
  // Prepare data for pie chart
  const pieData = [
    { name: "Present", value: attendanceStats.present, color: "#10b981" },
    { name: "Late", value: attendanceStats.late, color: "#f59e0b" },
    { name: "Absent", value: attendanceStats.absent, color: "#ef4444" },
  ].filter(item => item.value > 0);
  
  // Recent notices - get only global notices and class-specific notices for enrolled classes
  const recentNotices = notices
    .filter(notice => 
      notice.isGlobal || 
      (notice.classId && enrolledClassIds.includes(notice.classId))
    )
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);
  
  // Format date for notices
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
      title={`Welcome, ${currentUser?.name || "Student"}`}
      description="View your academic progress and class information"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left column - Class cards and attendance stats */}
        <div className="col-span-1 space-y-6 md:col-span-2">
          {/* Enrolled Classes */}
          <section className="reveal">
            <h2 className="mb-4 text-xl font-semibold text-white">Enrolled Classes</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {enrolledClasses.length === 0 ? (
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
                enrolledClasses.map((cls) => (
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
                      <p className="text-sm text-white/70">
                        Instructor: {cls.teacherName || "Not assigned"}
                      </p>
                      <p className="text-sm text-white/70">
                        Department: {cls.departmentCode}
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
          
          {/* Attendance Stats */}
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
                        {attendanceStats.percentage}%
                      </p>
                      <p className="text-sm text-white/70">Overall Attendance</p>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 p-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-green-500/10 p-3 text-center">
                        <p className="text-2xl font-bold text-green-400">
                          {attendanceStats.present}
                        </p>
                        <p className="text-sm text-green-400/80">Present</p>
                      </div>
                      <div className="rounded-lg bg-yellow-500/10 p-3 text-center">
                        <p className="text-2xl font-bold text-yellow-400">
                          {attendanceStats.late}
                        </p>
                        <p className="text-sm text-yellow-400/80">Late</p>
                      </div>
                      <div className="rounded-lg bg-red-500/10 p-3 text-center">
                        <p className="text-2xl font-bold text-red-400">
                          {attendanceStats.absent}
                        </p>
                        <p className="text-sm text-red-400/80">Absent</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-white/70">
                        Total Classes: <span className="text-white">{attendanceStats.total}</span>
                      </p>
                      
                      <div className="mt-3">
                        {attendanceStats.total === 0 ? (
                          <p className="text-white/70">
                            No attendance records found.
                          </p>
                        ) : attendanceStats.percentage < 75 ? (
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
        
        {/* Right column - Quick actions and notices */}
        <div className="col-span-1 space-y-6">
          {/* Quick Actions */}
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
                  onClick={() => window.open("/lovable-uploads/3fcc6e15-16d0-4bdb-8051-bd5314406f6c.png", "_blank")}
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
          
          {/* Recent Notices */}
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
                      <div className="mb-1 flex justify-between">
                        <h3 className="font-medium text-white">
                          {notice.title}
                        </h3>
                        <span className="text-xs text-white/50">
                          {formatDate(notice.createdAt)}
                        </span>
                      </div>
                      <p className="mb-2 text-sm text-white/70 line-clamp-2">
                        {notice.content}
                      </p>
                      {notice.isGlobal ? (
                        <span className="inline-flex items-center rounded-full bg-blue-700/30 px-2 py-0.5 text-xs font-medium text-blue-400">
                          Global
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-purple-700/30 px-2 py-0.5 text-xs font-medium text-purple-400">
                          {notice.className}
                        </span>
                      )}
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
