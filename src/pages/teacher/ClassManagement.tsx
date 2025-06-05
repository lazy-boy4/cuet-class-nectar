
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Calendar, Bell, FileText } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import AttendanceGrid from "@/components/teacher/AttendanceGrid";
import NoticeForm from "@/components/teacher/NoticeForm";
import { mockClasses } from "@/api/mockData/classes";
import { mockUsers } from "@/api/mockData/users";
import { fetchNotices } from "@/api";

const ClassManagement = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "teacher") {
      navigate("/login");
      return;
    }
    
    const teacher = mockUsers.find(u => u.role === "teacher");
    if (teacher) {
      setCurrentUser(teacher);
    }
  }, [navigate]);

  // Find the class
  const classData = mockClasses.find(cls => cls.id === classId);
  
  // Check if teacher has access to this class
  const hasAccess = classData && (
    classData.teacherId === currentUser?.id || 
    classData.teacherName === currentUser?.name
  );

  const { data: notices = [] } = useQuery({
    queryKey: ["classNotices", classId],
    queryFn: () => fetchNotices(),
    enabled: !!classId,
  });

  const classNotices = notices
    .filter(notice => notice.classId === classId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!classData) {
    return (
      <DashboardLayout title="Class Not Found" description="">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-white text-lg mb-4">Class not found</p>
          <Button onClick={() => navigate("/teacher/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!hasAccess) {
    return (
      <DashboardLayout title="Access Denied" description="">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-white text-lg mb-4">You don't have access to this class</p>
          <Button onClick={() => navigate("/teacher/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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
      title={`${classData.courseCode}: ${classData.courseName}`}
      description={`Section ${classData.section} • ${classData.session}`}
    >
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate("/teacher/dashboard")}
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
              Department: {classData.departmentCode}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="attendance" className="text-white data-[state=active]:bg-blue-600">
            <Users className="mr-2 h-4 w-4" />
            Attendance
          </TabsTrigger>
          <TabsTrigger value="notices" className="text-white data-[state=active]:bg-blue-600">
            <Bell className="mr-2 h-4 w-4" />
            Notices
          </TabsTrigger>
          <TabsTrigger value="schedule" className="text-white data-[state=active]:bg-blue-600">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <AttendanceGrid classId={classId!} />
        </TabsContent>

        <TabsContent value="notices">
          <div className="space-y-6">
            <NoticeForm classId={classId!} />
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Previous Notices</h3>
              {classNotices.length === 0 ? (
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <Bell className="mb-2 h-12 w-12 text-white/30" />
                    <p className="text-white/70">No notices posted yet</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {classNotices.map((notice) => (
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Class Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8">
                <FileText className="mb-4 h-16 w-16 text-white/30" />
                <p className="text-white/70 mb-4">No schedule uploaded yet</p>
                <Button variant="outline">
                  Upload Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ClassManagement;
