import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users, LogIn, School, BookOpen, Crown } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMyClassrooms } from "@/api/classroom";
import ClassroomCard from "@/components/classroom/ClassroomCard";

const MyClassrooms = () => {
  const navigate = useNavigate();

  const { data: classrooms = [], isLoading, error } = useQuery({
    queryKey: ["myClassrooms"],
    queryFn: getMyClassrooms,
  });

  // Get current user ID to identify if user is CR
  const currentUserId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

  return (
    <DashboardLayout
      title="My Classrooms"
      description="View and manage your classrooms"
    >
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button
          onClick={() => navigate("/student/classrooms/create")}
          className="bg-cuet-blue hover:bg-cuet-blue/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Classroom
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate("/student/classrooms/join")}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Join Classroom
        </Button>
      </div>

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
            <p className="text-lg text-white mb-2">Failed to load classrooms</p>
            <p className="text-sm text-white/70 mb-4">Please try again later</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isLoading && !error && classrooms.length === 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <School className="mb-4 h-16 w-16 text-white/30" />
            <h3 className="text-xl font-semibold text-white mb-2">No Classrooms Yet</h3>
            <p className="text-white/70 text-center max-w-md mb-6">
              Create a new classroom to become a Class Representative, or join an existing one using a code from your CR.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate("/student/classrooms/create")}
                className="bg-cuet-blue hover:bg-cuet-blue/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Classroom
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/student/classrooms/join")}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Join Classroom
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classroom Grid */}
      {!isLoading && !error && classrooms.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classrooms.map((classroom) => (
            <ClassroomCard
              key={classroom.id}
              classroom={classroom}
              isCR={classroom.crId === currentUserId}
              onClick={() => navigate(`/student/classrooms/${classroom.id}`)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyClassrooms;
