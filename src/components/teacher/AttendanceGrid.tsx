
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { mockStudents } from "@/api/mockData/users";

interface AttendanceGridProps {
  classId: string;
}

const AttendanceGrid = ({ classId }: AttendanceGridProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late">>({});

  const enrolledStudents = mockStudents.filter(student => 
    // Mock enrollment logic - in real app, this would come from enrollment data
    student.department === "04 - Computer Science and Engineering"
  ).slice(0, 45); // Limit to reasonable class size

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const getAttendanceIcon = (status: "present" | "absent" | "late" | undefined) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "late":
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case "absent":
        return <XCircle className="h-5 w-5 text-red-400" />;
      default:
        return <div className="h-5 w-5 rounded-full border border-white/20" />;
    }
  };

  const getAttendanceCount = () => {
    const total = enrolledStudents.length;
    const present = Object.values(attendance).filter(status => status === "present").length;
    const late = Object.values(attendance).filter(status => status === "late").length;
    const absent = Object.values(attendance).filter(status => status === "absent").length;
    const unmarked = total - present - late - absent;

    return { total, present, late, absent, unmarked };
  };

  const stats = getAttendanceCount();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Mark Attendance</h3>
          <p className="text-sm text-white/70">
            Select date and mark attendance for each student
          </p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal bg-white/5 border-white/10",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-gray-900 border-white/10" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
              className="rounded-md border-0"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-white/70">Total</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-green-500/10">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-400">{stats.present}</p>
            <p className="text-xs text-green-400/80">Present</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-yellow-500/10">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-yellow-400">{stats.late}</p>
            <p className="text-xs text-yellow-400/80">Late</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-red-500/10">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-400">{stats.absent}</p>
            <p className="text-xs text-red-400/80">Absent</p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-blue-500/10">
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-blue-400">{stats.unmarked}</p>
            <p className="text-xs text-blue-400/80">Unmarked</p>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <Card className="border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-white">Students ({enrolledStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {enrolledStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-medium">
                    {student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{student.name}</p>
                    <p className="text-sm text-white/60">{student.email}</p>
                  </div>
                  {student.isClassRepresentative && (
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 text-xs">
                      CR
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {getAttendanceIcon(attendance[student.id])}
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant={attendance[student.id] === "present" ? "default" : "outline"}
                      onClick={() => handleAttendanceChange(student.id, "present")}
                      className={cn(
                        "h-8 px-2 text-xs",
                        attendance[student.id] === "present" 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "hover:bg-green-600/20"
                      )}
                    >
                      Present
                    </Button>
                    <Button
                      size="sm"
                      variant={attendance[student.id] === "late" ? "default" : "outline"}
                      onClick={() => handleAttendanceChange(student.id, "late")}
                      className={cn(
                        "h-8 px-2 text-xs",
                        attendance[student.id] === "late" 
                          ? "bg-yellow-600 hover:bg-yellow-700" 
                          : "hover:bg-yellow-600/20"
                      )}
                    >
                      Late
                    </Button>
                    <Button
                      size="sm"
                      variant={attendance[student.id] === "absent" ? "default" : "outline"}
                      onClick={() => handleAttendanceChange(student.id, "absent")}
                      className={cn(
                        "h-8 px-2 text-xs",
                        attendance[student.id] === "absent" 
                          ? "bg-red-600 hover:bg-red-700" 
                          : "hover:bg-red-600/20"
                      )}
                    >
                      Absent
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setAttendance({})}>
          Clear All
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={Object.keys(attendance).length === 0}
        >
          Save Attendance
        </Button>
      </div>
    </div>
  );
};

export default AttendanceGrid;
