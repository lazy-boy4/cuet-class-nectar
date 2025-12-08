import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Users, ArrowRight, LogIn } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { joinClassroom } from "@/api/classroom";
import { Classroom } from "@/types";

const JoinClassroom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState("");
  const [previewClassroom, setPreviewClassroom] = useState<Classroom | null>(null);

  // Join classroom mutation
  const joinMutation = useMutation({
    mutationFn: (classCode: string) => joinClassroom(classCode),
    onSuccess: (data) => {
      if (data.success && data.classroom) {
        toast({
          title: "Joined Successfully!",
          description: `You have joined "${data.classroom.name}"`,
        });
        navigate(`/student/classrooms/${data.classroom.id}`);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to join classroom",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Invalid classroom code or classroom not found",
        variant: "destructive",
      });
    },
  });

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setCode(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Classroom code must be 6 characters",
        variant: "destructive",
      });
      return;
    }
    joinMutation.mutate(code);
  };

  return (
    <DashboardLayout
      title="Join Classroom"
      description="Enter the classroom code to join"
    >
      <div className="max-w-md mx-auto">
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cuet-blue/20">
              <Users className="h-8 w-8 text-cuet-blue" />
            </div>
            <CardTitle className="text-2xl text-white">Join a Classroom</CardTitle>
            <CardDescription className="text-white/70">
              Ask your CR for the 6-character classroom code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-white">Classroom Code</Label>
                <Input
                  id="code"
                  placeholder="Enter 6-character code"
                  value={code}
                  onChange={handleCodeChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-center text-2xl font-mono tracking-widest uppercase"
                  maxLength={6}
                />
                <p className="text-xs text-white/50 text-center">
                  {code.length}/6 characters
                </p>
              </div>

              {previewClassroom && (
                <div className="rounded-lg bg-white/10 p-4">
                  <h4 className="font-medium text-white mb-2">Classroom Preview</h4>
                  <div className="space-y-1 text-sm text-white/70">
                    <p><span className="text-white">Name:</span> {previewClassroom.name}</p>
                    <p><span className="text-white">Department:</span> {previewClassroom.departmentName}</p>
                    <p><span className="text-white">Section:</span> {previewClassroom.section}</p>
                    <p><span className="text-white">Session:</span> {previewClassroom.session}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={code.length !== 6 || joinMutation.isPending}
                  className="w-full bg-cuet-blue hover:bg-cuet-blue/90"
                >
                  {joinMutation.isPending ? (
                    "Joining..."
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Join Classroom
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/student/classrooms")}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-white/70 text-center mb-3">
                Don't have a code? Create your own classroom!
              </p>
              <Button
                variant="ghost"
                onClick={() => navigate("/student/classrooms/create")}
                className="w-full text-cuet-blue hover:text-cuet-blue hover:bg-cuet-blue/10"
              >
                Create Classroom
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default JoinClassroom;
