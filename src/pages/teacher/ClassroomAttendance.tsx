import React, { useState, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  ClipboardCheck,
  Check,
  X,
  Calendar,
  Users,
  Shield,
  Save
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  getClassroomById,
  getClassroomCourses,
  getClassroomStudentsForAttendance,
  markClassroomAttendance,
  getClassroomAttendance,
  grantCRPermission,
  revokeCRPermission,
  checkCRPermission
} from "@/api/classroom";
import StudentAttendanceRow from "@/components/classroom/StudentAttendanceRow";

const ClassroomAttendance = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const initialCourseId = searchParams.get("courseId") || "";
  const today = format(new Date(), "yyyy-MM-dd");

  const [selectedCourseId, setSelectedCourseId] = useState(initialCourseId);
  const [selectedDate, setSelectedDate] = useState(today);
  const [attendanceData, setAttendanceData] = useState<Record<string, "present" | "absent" | "late">>({});

  // Fetch classroom details
  const { data: classroom, isLoading: loadingClassroom } = useQuery({
    queryKey: ["classroom", classroomId],
    queryFn: () => getClassroomById(classroomId!),
    enabled: !!classroomId,
  });

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ["classroomCourses", classroomId],
    queryFn: () => getClassroomCourses(classroomId!),
    enabled: !!classroomId,
  });

  // Fetch students
  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ["classroomStudents", classroomId],
    queryFn: () => getClassroomStudentsForAttendance(classroomId!),
    enabled: !!classroomId,
  });

  // Fetch existing attendance
  const { data: existingAttendance = [] } = useQuery({
    queryKey: ["classroomAttendance", classroomId, selectedCourseId, selectedDate],
    queryFn: () => getClassroomAttendance(classroomId!, selectedCourseId, selectedDate),
    enabled: !!classroomId && !!selectedCourseId,
  });

  // Pre-fill attendance data
  React.useEffect(() => {
    if (existingAttendance.length > 0) {
      const existing: Record<string, "present" | "absent" | "late"> = {};
      existingAttendance.forEach((record) => {
        existing[record.studentId] = record.status;
      });
      setAttendanceData(existing);
    }
  }, [existingAttendance]);

  // Check if CR has permission for today
  const { data: crPermission, refetch: refetchPermission } = useQuery({
    queryKey: ["crPermission", classroomId, selectedCourseId, selectedDate],
    queryFn: () => checkCRPermission(classroomId!, selectedCourseId, selectedDate),
    enabled: !!classroomId && !!selectedCourseId && selectedDate === today,
  });

  // Submit attendance mutation
  const submitMutation = useMutation({
    mutationFn: () => {
      const records = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      return markClassroomAttendance(classroomId!, selectedCourseId, selectedDate, records);
    },
    onSuccess: () => {
      toast({ title: "Attendance Saved", description: "Attendance has been recorded successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save attendance", variant: "destructive" });
    },
  });

  // Grant CR permission mutation
  const grantPermissionMutation = useMutation({
    mutationFn: () => grantCRPermission(classroomId!, selectedCourseId, classroom?.crId || "", selectedDate),
    onSuccess: () => {
      toast({ title: "Permission Granted", description: "CR can now take attendance for today" });
      refetchPermission();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to grant permission", variant: "destructive" });
    },
  });

  // Revoke CR permission mutation
  const revokePermissionMutation = useMutation({
    mutationFn: () => revokeCRPermission(classroomId!, crPermission?.permission?.id || ""),
    onSuccess: () => {
      toast({ title: "Permission Revoked", description: "CR permission has been revoked" });
      refetchPermission();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to revoke permission", variant: "destructive" });
    },
  });

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const allPresent: Record<string, "present"> = {};
    students.forEach((student) => {
      allPresent[student.studentId] = "present";
    });
    setAttendanceData(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent: Record<string, "absent"> = {};
    students.forEach((student) => {
      allAbsent[student.studentId] = "absent";
    });
    setAttendanceData(allAbsent);
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

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

  return (
    <DashboardLayout
      title="Take Attendance"
      description={classroom?.name || "Classroom Attendance"}
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/teacher/assigned-classes")}
        className="mb-4 text-white/70 hover:text-white"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Assigned Classes
      </Button>

      {/* Header Card */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Course Selection */}
            <div className="space-y-2">
              <Label className="text-white/70">Course</Label>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.courseCode} - {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label className="text-white/70">Date</Label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={today}
                className="w-full h-10 px-3 rounded-md bg-white/10 border border-white/20 text-white"
              />
            </div>

            {/* Stats */}
            <div className="flex items-end gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{students.length}</p>
                <p className="text-xs text-white/70">Students</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {Object.values(attendanceData).filter((s) => s === "present").length}
                </p>
                <p className="text-xs text-white/70">Present</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">
                  {Object.values(attendanceData).filter((s) => s === "absent").length}
                </p>
                <p className="text-xs text-white/70">Absent</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CR Permission Toggle (only for today) */}
      {selectedCourseId && selectedDate === today && classroom?.crId && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="text-sm font-medium text-white">CR Attendance Permission</p>
                  <p className="text-xs text-white/70">
                    {crPermission?.hasPermission
                      ? `CR (${classroom.crName}) can take attendance today`
                      : "Allow CR to take attendance on your behalf today"}
                  </p>
                </div>
              </div>
              <Switch
                checked={crPermission?.hasPermission || false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    grantPermissionMutation.mutate();
                  } else {
                    revokePermissionMutation.mutate();
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      {selectedCourseId && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-white/70">
            {Object.keys(attendanceData).length} of {students.length} marked
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllPresent}>
              <Check className="mr-1 h-4 w-4 text-green-400" />
              All Present
            </Button>
            <Button variant="outline" size="sm" onClick={markAllAbsent}>
              <X className="mr-1 h-4 w-4 text-red-400" />
              All Absent
            </Button>
          </div>
        </div>
      )}

      {/* Student List */}
      {selectedCourseId && !loadingStudents && (
        <div className="space-y-2">
          {students.map((student) => (
            <StudentAttendanceRow
              key={student.id}
              studentId={student.studentId}
              studentName={student.studentName}
              studentIdNumber={student.studentIdNumber}
              status={attendanceData[student.studentId]}
              onStatusChange={(status) => handleStatusChange(student.studentId, status)}
            />
          ))}
        </div>
      )}

      {/* No Course Selected */}
      {!selectedCourseId && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Calendar className="mb-4 h-12 w-12 text-white/30" />
            <p className="text-white/70">Select a course to take attendance</p>
          </CardContent>
        </Card>
      )}

      {/* No Students */}
      {selectedCourseId && !loadingStudents && students.length === 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Users className="mb-4 h-12 w-12 text-white/30" />
            <p className="text-white/70">No students in this classroom</p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      {selectedCourseId && students.length > 0 && (
        <div className="flex justify-end pt-6">
          <Button
            onClick={() => submitMutation.mutate()}
            disabled={submitMutation.isPending || Object.keys(attendanceData).length === 0}
            className="bg-cuet-blue hover:bg-cuet-blue/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {submitMutation.isPending ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClassroomAttendance;
