
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Bell, Users, FileText, Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockClasses } from "@/api/mockData/classes";
import { mockUsers } from "@/api/mockData/users";
import { fetchNotices, fetchAttendance } from "@/api";

const ClassDetails = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "student") {
      navigate("/login");
      return;
    }
    
    const student = mockUsers.find(u => u.role === "student");
    if (student) {
      setCurrentUser(student);
    }
  }, [navigate]);

  const classData = mockClasses.find(cls => cls.id === classId);

  const { data: notices = [] } = useQuery({
    queryKey: ["classNotices", classId],
    queryFn: () => fetchNotices(),
    enabled: !!classId,
  });

  const { data: attendanceData = [] } = useQuery({
    queryKey: ["studentClassAttendance", currentUser?.id, classId],
    queryFn: async () => {
      if (!currentUser || !classId) return [];
      const classAttendance = await fetchAttendance(classId);
      return classAttendance.filter(a => a.studentId === currentUser.id);
    },
    enabled: !!currentUser && !!classId,
  });

  if (!classData) {
    return (
      <DashboardLayout title="Class Not Found" description="">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-white text-lg mb-4">Class not found</p>
          <Button onClick={() => navigate("/student/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const classNotices = notices
    .filter(notice => notice.classId === classId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const calculateAttendancePercentage = () => {
    if (attendanceData.length === 0) return 0;
    const present = attendanceData.filter(a => a.status === "present").length;
    const late = attendanceData.filter(a => a.status === "late").length;
    return Math.round(((present + late * 0.5) / attendanceData.length) * 100);
  };

  return (
    <DashboardLayout
      title={`${classData.courseCode}: ${classData.courseName}`}
      description={`Section ${classData.section} • ${classData.session}`}
    >
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/student/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>{classData.courseCode}: {classData.courseName}</span>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                  {classData.session}
                </Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-400">
                  Section {classData.section}
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              Department: {classData.departmentCode} • Instructor: {classData.teacherName || "TBA"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="attendance" className="text-white data-[state=active]:bg-blue-600">
            <Calendar className="mr-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="notices" className="text-white data-[state=active]:bg-blue-600">
            <Bell className="mr-2 h-4 w-4" />
            Notices
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-white data-[state=active]:bg-blue-600">
            <FileText className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
          {currentUser?.isClassRepresentative && (
            <TabsTrigger value="management" className="text-white data-[state=active]:bg-blue-600">
              <Users className="mr-2 h-4 w-4" />
              CR Panel
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="attendance">
          <div className="space-y-6">
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white">Your Attendance</CardTitle>
                <CardDescription>
                  Attendance percentage: {calculateAttendancePercentage()}%
                </CardDescription>
              </CardHeader>
              <CardContent>
                {attendanceData.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-white/30 mx-auto mb-4" />
                    <p className="text-white/70">No attendance records yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attendanceData.map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
                      >
                        <span className="text-white">{formatDate(record.date)}</span>
                        <Badge
                          variant="outline"
                          className={
                            record.status === "present"
                              ? "bg-green-500/10 text-green-400"
                              : record.status === "late"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notices">
          <div className="space-y-4">
            {classNotices.length === 0 ? (
              <Card className="border-white/10 bg-white/5">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <Bell className="mb-2 h-12 w-12 text-white/30" />
                  <p className="text-white/70">No notices posted yet</p>
                </CardContent>
              </Card>
            ) : (
              classNotices.map((notice) => (
                <Card key={notice.id} className="border-white/10 bg-white/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{notice.title}</CardTitle>
                      <span className="text-sm text-white/60">
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/80">{notice.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Class Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8">
                <FileText className="mb-4 h-16 w-16 text-white/30" />
                <p className="text-white/70 mb-4">No schedule available</p>
                <Button 
                  variant="outline"
                  onClick={() => window.open("/lovable-uploads/3fcc6e15-16d0-4bdb-8051-bd5314406f6c.png", "_blank")}
                >
                  View Class Routine
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {currentUser?.isClassRepresentative && (
          <TabsContent value="management">
            <div className="space-y-6">
              <Card className="border-white/10 bg-white/5">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="mr-2 h-5 w-5" />
                    Class Representative Panel
                  </CardTitle>
                  <CardDescription>
                    Manage class enrollments and notices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Approve Enrollments
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Post Notice
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Upload Routine
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="mr-2 h-4 w-4" />
                      Set Test Date
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export default ClassDetails;
