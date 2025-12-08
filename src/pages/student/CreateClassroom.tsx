import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Copy, Check, School } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createClassroom, getAllDepartments, generateClassroomCode } from "@/api/classroom";

const CreateClassroom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    departmentId: "",
    section: "",
    session: "",
  });

  // Fetch departments
  const { data: departments = [], isLoading: loadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
  });

  // Create classroom mutation
  const createMutation = useMutation({
    mutationFn: createClassroom,
    onSuccess: (data) => {
      setCreatedCode(data.code);
      toast({
        title: "Classroom Created!",
        description: `Your classroom "${data.name}" has been created successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create classroom",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.departmentId || !formData.section || !formData.session) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(formData);
  };

  const copyCode = () => {
    if (createdCode) {
      navigator.clipboard.writeText(createdCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Session options (current year and past 5 years)
  const currentYear = new Date().getFullYear();
  const sessionOptions = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - i;
    return `${year}-${year + 1}`;
  });

  // Section options
  const sectionOptions = ["A", "B", "C", "D", "E"];

  if (createdCode) {
    return (
      <DashboardLayout
        title="Classroom Created!"
        description="Share this code with your classmates"
      >
        <div className="max-w-md mx-auto">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <Check className="h-8 w-8 text-green-400" />
              </div>
              <CardTitle className="text-2xl text-white">Success!</CardTitle>
              <CardDescription className="text-white/70">
                Your classroom has been created. Share the code below with your classmates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-white/10 p-6 text-center">
                <p className="text-sm text-white/70 mb-2">Classroom Join Code</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-4xl font-mono font-bold tracking-widest text-white">
                    {createdCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyCode}
                    className="text-white/70 hover:text-white"
                  >
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/student/classrooms")}
                  className="w-full bg-cuet-blue hover:bg-cuet-blue/90"
                >
                  Go to My Classrooms
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreatedCode(null);
                    setFormData({ name: "", departmentId: "", section: "", session: "" });
                  }}
                  className="w-full"
                >
                  Create Another Classroom
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Create Classroom"
      description="Create a new classroom for your section"
    >
      <div className="max-w-lg mx-auto">
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cuet-blue/20">
                <School className="h-6 w-6 text-cuet-blue" />
              </div>
              <div>
                <CardTitle className="text-white">New Classroom</CardTitle>
                <CardDescription className="text-white/70">
                  You will be the Class Representative (CR)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Classroom Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., CSE 2021 Section A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="text-white">Department</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingDepartments ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : (
                      departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="section" className="text-white">Section</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => setFormData({ ...formData, section: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionOptions.map((section) => (
                        <SelectItem key={section} value={section}>
                          Section {section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session" className="text-white">Session</Label>
                  <Select
                    value={formData.session}
                    onValueChange={(value) => setFormData({ ...formData, session: value })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionOptions.map((session) => (
                        <SelectItem key={session} value={session}>
                          {session}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/student/classrooms")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 bg-cuet-blue hover:bg-cuet-blue/90"
                >
                  {createMutation.isPending ? "Creating..." : "Create Classroom"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateClassroom;
