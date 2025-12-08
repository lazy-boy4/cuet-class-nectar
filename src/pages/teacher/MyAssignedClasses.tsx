import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, ClipboardCheck, ArrowRight, School } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTeacherAssignedClassrooms } from "@/api/classroom";

const MyAssignedClasses = () => {
  const navigate = useNavigate();

  const { data: assignedClasses = [], isLoading, error } = useQuery({
    queryKey: ["teacherAssignedClassrooms"],
    queryFn: getTeacherAssignedClassrooms,
  });

  return (
    <DashboardLayout
      title="My Assigned Classes"
      description="Classrooms where you are assigned as a teacher"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-white/10 bg-white/5 backdrop-blur-sm animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-white/10 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-white/10 rounded mb-2 w-1/2"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <School className="mb-4 h-12 w-12 text-destructive" />
            <p className="text-lg text-white mb-2">Failed to load assigned classes</p>
            <p className="text-sm text-white/70 mb-4">Please try again later</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && assignedClasses.length === 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <BookOpen className="mb-4 h-16 w-16 text-white/30" />
            <h3 className="text-xl font-semibold text-white mb-2">No Assigned Classes</h3>
            <p className="text-white/70 text-center max-w-md">
              You haven't been assigned to any classroom courses yet.
              Class Representatives (CRs) can assign teachers to their courses.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Assigned Classes Grid */}
      {!isLoading && !error && assignedClasses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignedClasses.map((assignment) => (
            <Card
              key={assignment.id}
              className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all duration-300 cursor-pointer group"
              onClick={() => navigate(`/teacher/classroom/${assignment.classroomId}/attendance?courseId=${assignment.courseId}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                    <BookOpen className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white group-hover:text-cuet-blue transition-colors">
                      {assignment.courseCode}
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      {assignment.courseName}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="mb-3">
                  <p className="text-sm text-white/80 font-medium">{assignment.classroomName}</p>
                  <p className="text-xs text-white/50">
                    {assignment.departmentName} • Section {assignment.section} • {assignment.session}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                    <Users className="mr-1 h-3 w-3" />
                    {assignment.studentCount} students
                  </Badge>
                  {assignment.crName && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                      CR: {assignment.crName}
                    </Badge>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-cuet-blue group-hover:text-white group-hover:border-cuet-blue"
                >
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  Take Attendance
                  <ArrowRight className="ml-auto h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyAssignedClasses;
