import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ClipboardCheck, AlertCircle, Check, X, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ClassroomCourse, ClassroomMember } from "@/types";
import { checkCRPermission, markClassroomAttendance, getClassroomAttendance } from "@/api/classroom";
import StudentAttendanceRow from "./StudentAttendanceRow";

interface CRAttendanceProps {
  classroomId: string;
  courses: ClassroomCourse[];
  members: ClassroomMember[];
}

const CRAttendance: React.FC<CRAttendanceProps> = ({ classroomId, courses, members }) => {
  const { toast } = useToast();
  const today = format(new Date(), "yyyy-MM-dd");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [attendanceData, setAttendanceData] = useState<Record<string, "present" | "absent" | "late">>({});

  // Check if CR has permission for today
  const { data: permissionData, isLoading: checkingPermission } = useQuery({
    queryKey: ["crPermission", classroomId, selectedCourseId, today],
    queryFn: () => checkCRPermission(classroomId, selectedCourseId, today),
    enabled: !!selectedCourseId,
  });

  // Get existing attendance for today
  const { data: existingAttendance = [], isLoading: loadingAttendance } = useQuery({
    queryKey: ["classroomAttendance", classroomId, selectedCourseId, today],
    queryFn: () => getClassroomAttendance(classroomId, selectedCourseId, today),
    enabled: !!selectedCourseId && permissionData?.hasPermission,
  });

  // Pre-fill attendance data when existing attendance loads
  React.useEffect(() => {
    if (existingAttendance.length > 0) {
      const existing: Record<string, "present" | "absent" | "late"> = {};
      existingAttendance.forEach((record) => {
        existing[record.studentId] = record.status;
      });
      setAttendanceData(existing);
    }
  }, [existingAttendance]);

  // Submit attendance mutation
  const submitMutation = useMutation({
    mutationFn: () => {
      const records = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        status,
      }));
      return markClassroomAttendance(classroomId, selectedCourseId, today, records);
    },
    onSuccess: () => {
      toast({ title: "Attendance Saved", description: "Attendance has been recorded successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save attendance", variant: "destructive" });
    },
  });

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const allPresent: Record<string, "present"> = {};
    members.forEach((member) => {
      allPresent[member.studentId] = "present";
    });
    setAttendanceData(allPresent);
  };

  const markAllAbsent = () => {
    const allAbsent: Record<string, "absent"> = {};
    members.forEach((member) => {
      allAbsent[member.studentId] = "absent";
    });
    setAttendanceData(allAbsent);
  };

  const hasPermission = permissionData?.hasPermission;
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <div className="space-y-4">
      {/* Course Selection */}
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Take Attendance
          </CardTitle>
          <CardDescription className="text-white/70">
            Select a course to take attendance for today ({format(new Date(), "MMMM d, yyyy")})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.courseCode} - {course.courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Permission Check */}
      {selectedCourseId && checkingPermission && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <p className="text-white/70">Checking permission...</p>
          </CardContent>
        </Card>
      )}

      {/* No Permission Message */}
      {selectedCourseId && !checkingPermission && !hasPermission && (
        <Card className="border-yellow-500/20 bg-yellow-500/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-1">No Permission</h3>
                <p className="text-yellow-300/80 text-sm">
                  You don't have permission to take attendance for {selectedCourse?.courseName} today.
                  Ask the course teacher to grant you permission.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Form */}
      {selectedCourseId && hasPermission && (
        <>
          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">
              {members.length} students • {Object.keys(attendanceData).length} marked
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

          {/* Student List */}
          <div className="space-y-2">
            {members.map((member) => (
              <StudentAttendanceRow
                key={member.id}
                studentId={member.studentId}
                studentName={member.studentName}
                studentIdNumber={member.studentIdNumber}
                status={attendanceData[member.studentId]}
                onStatusChange={(status) => handleStatusChange(member.studentId, status)}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending || Object.keys(attendanceData).length === 0}
              className="bg-cuet-blue hover:bg-cuet-blue/90"
            >
              {submitMutation.isPending ? "Saving..." : "Save Attendance"}
            </Button>
          </div>
        </>
      )}

      {/* No Course Selected */}
      {!selectedCourseId && courses.length > 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Calendar className="mb-4 h-12 w-12 text-white/30" />
            <p className="text-white/70">Select a course to take attendance</p>
          </CardContent>
        </Card>
      )}

      {/* No Courses */}
      {courses.length === 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <ClipboardCheck className="mb-4 h-12 w-12 text-white/30" />
            <p className="text-white/70">Add courses to the classroom first</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CRAttendance;
