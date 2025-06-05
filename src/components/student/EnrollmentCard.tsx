
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Clock, Users, BookOpen } from "lucide-react";

interface EnrollmentCardProps {
  classData: {
    id: string;
    courseCode: string;
    courseName: string;
    section: string;
    session: string;
    departmentCode: string;
    teacherName?: string;
  };
  isEnrolled: boolean;
  enrollmentStatus?: "pending" | "approved" | "rejected";
  onEnroll: (classId: string) => void;
}

const EnrollmentCard = ({ classData, isEnrolled, enrollmentStatus, onEnroll }: EnrollmentCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      onEnroll(classData.id);
      toast({
        title: "Enrollment Request Sent",
        description: "Your enrollment request has been sent to the Class Representative for approval.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send enrollment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!isEnrolled && !enrollmentStatus) {
      return null;
    }

    switch (enrollmentStatus) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-400">Enrolled</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-400">Rejected</Badge>;
      default:
        return isEnrolled ? <Badge variant="outline" className="bg-green-500/10 text-green-400">Enrolled</Badge> : null;
    }
  };

  const getActionButton = () => {
    if (isEnrolled || enrollmentStatus === "approved") {
      return (
        <Button variant="outline" size="sm" disabled>
          <BookOpen className="mr-1 h-4 w-4" />
          Enrolled
        </Button>
      );
    }

    if (enrollmentStatus === "pending") {
      return (
        <Button variant="outline" size="sm" disabled>
          <Clock className="mr-1 h-4 w-4" />
          Pending Approval
        </Button>
      );
    }

    if (enrollmentStatus === "rejected") {
      return (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEnroll}
          disabled={isLoading}
        >
          Reapply
        </Button>
      );
    }

    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleEnroll}
        disabled={isLoading}
      >
        {isLoading ? "Enrolling..." : "Enroll"}
      </Button>
    );
  };

  return (
    <Card className="border-white/10 bg-white/5 hover:bg-white/[0.07] transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-white">
              {classData.courseCode}: {classData.courseName}
            </CardTitle>
            <CardDescription>
              Section {classData.section} • {classData.session}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-white/70">
            Department: {classData.departmentCode}
          </p>
          {classData.teacherName && (
            <p className="text-sm text-white/70">
              Instructor: {classData.teacherName}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-white/60">
            <Users className="mr-1 h-4 w-4" />
            <span>45 students</span>
          </div>
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnrollmentCard;
