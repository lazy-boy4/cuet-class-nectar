import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Users,
  Bell,
  ClipboardCheck,
  Settings,
  Copy,
  Check,
  ArrowLeft,
  Crown
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getClassroomById, getClassroomCourses, getClassroomMembers } from "@/api/classroom";
import CourseManagement from "@/components/classroom/CourseManagement";
import MemberManagement from "@/components/classroom/MemberManagement";
import CRAttendance from "@/components/classroom/CRAttendance";
import JoinCodeDisplay from "@/components/classroom/JoinCodeDisplay";

const ClassroomDetail = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("courses");

  // Get current user ID
  const currentUserId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

  // Fetch classroom details
  const { data: classroom, isLoading: loadingClassroom } = useQuery({
    queryKey: ["classroom", classroomId],
    queryFn: () => getClassroomById(classroomId!),
    enabled: !!classroomId,
  });

  // Fetch classroom courses
  const { data: courses = [], isLoading: loadingCourses, refetch: refetchCourses } = useQuery({
    queryKey: ["classroomCourses", classroomId],
    queryFn: () => getClassroomCourses(classroomId!),
    enabled: !!classroomId,
  });

  // Fetch classroom members
  const { data: members = [], isLoading: loadingMembers, refetch: refetchMembers } = useQuery({
    queryKey: ["classroomMembers", classroomId],
    queryFn: () => getClassroomMembers(classroomId!),
    enabled: !!classroomId,
  });

  const isCR = classroom?.crId === currentUserId;

  if (loadingClassroom) {
    return (
      <DashboardLayout title="Loading..." description="Fetching classroom details">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-white/10 rounded-lg"></div>
          <div className="h-64 bg-white/10 rounded-lg"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!classroom) {
    return (
      <DashboardLayout title="Classroom Not Found" description="">
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-white mb-4">This classroom does not exist or you don't have access.</p>
            <Button onClick={() => navigate("/student/classrooms")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Classrooms
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={classroom.name}
      description={`${classroom.departmentName || classroom.departmentCode} • Section ${classroom.section} • ${classroom.session}`}
    >
      {/* Back Button & Header Info */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/student/classrooms")}
          className="mb-4 text-white/70 hover:text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Classrooms
        </Button>

        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-cuet-blue/20">
                  <BookOpen className="h-7 w-7 text-cuet-blue" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-white">{classroom.name}</h2>
                    {isCR && (
                      <Badge className="bg-cuet-gold/20 text-cuet-gold border-cuet-gold/30">
                        <Crown className="mr-1 h-3 w-3" />
                        CR
                      </Badge>
                    )}
                  </div>
                  <p className="text-white/70">
                    {classroom.departmentName || classroom.departmentCode} • Section {classroom.section} • {classroom.session}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{members.length}</p>
                  <p className="text-xs text-white/70">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{courses.length}</p>
                  <p className="text-xs text-white/70">Courses</p>
                </div>
                {isCR && <JoinCodeDisplay code={classroom.code} />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="courses" className="data-[state=active]:bg-cuet-blue">
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="members" className="data-[state=active]:bg-cuet-blue">
            <Users className="mr-2 h-4 w-4" />
            Members
          </TabsTrigger>
          {isCR && (
            <TabsTrigger value="attendance" className="data-[state=active]:bg-cuet-blue">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Attendance
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="courses">
          <CourseManagement
            classroomId={classroomId!}
            courses={courses}
            isCR={isCR}
            isLoading={loadingCourses}
            onRefetch={refetchCourses}
          />
        </TabsContent>

        <TabsContent value="members">
          <MemberManagement
            classroomId={classroomId!}
            members={members}
            isCR={isCR}
            isLoading={loadingMembers}
            crId={classroom.crId}
            onRefetch={refetchMembers}
          />
        </TabsContent>

        {isCR && (
          <TabsContent value="attendance">
            <CRAttendance
              classroomId={classroomId!}
              courses={courses}
              members={members}
            />
          </TabsContent>
        )}
      </Tabs>
    </DashboardLayout>
  );
};

export default ClassroomDetail;
