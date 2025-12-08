import React from "react";
import { Check, X, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface StudentAttendanceRowProps {
  studentId: string;
  studentName: string;
  studentIdNumber?: string;
  status?: "present" | "absent" | "late";
  onStatusChange: (status: "present" | "absent" | "late") => void;
}

const StudentAttendanceRow: React.FC<StudentAttendanceRowProps> = ({
  studentId,
  studentName,
  studentIdNumber,
  status,
  onStatusChange,
}) => {
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className={cn(
      "border-white/10 bg-white/5 backdrop-blur-sm transition-all",
      status === "present" && "border-l-4 border-l-green-500",
      status === "absent" && "border-l-4 border-l-red-500",
      status === "late" && "border-l-4 border-l-yellow-500"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-white/10">
              <AvatarFallback className="bg-cuet-blue/20 text-cuet-blue text-sm">
                {getInitials(studentName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium text-white">{studentName}</h4>
              {studentIdNumber && (
                <p className="text-xs text-white/50">ID: {studentIdNumber}</p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={status === "present" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange("present")}
              className={cn(
                "transition-all",
                status === "present"
                  ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
                  : "hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50"
              )}
            >
              <Check className="h-4 w-4 mr-1" />
              Present
            </Button>
            <Button
              variant={status === "absent" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange("absent")}
              className={cn(
                "transition-all",
                status === "absent"
                  ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
                  : "hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50"
              )}
            >
              <X className="h-4 w-4 mr-1" />
              Absent
            </Button>
            <Button
              variant={status === "late" ? "default" : "outline"}
              size="sm"
              onClick={() => onStatusChange("late")}
              className={cn(
                "transition-all",
                status === "late"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                  : "hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/50"
              )}
            >
              <Clock className="h-4 w-4 mr-1" />
              Late
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAttendanceRow;
