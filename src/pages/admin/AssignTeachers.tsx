
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Save, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClassesForAdmin, fetchUsersForAdmin, assignTeachersToClass, unassignTeachersFromClass } from "@/api/admin";
import { Class, User } from "@/types";

const QuickAdminNav = () => (
  <nav className="mb-8 flex flex-wrap gap-3">
    <Link to="/admin/dashboard" className="btn-secondary">Dashboard</Link>
    <Link to="/admin/departments" className="btn-secondary">Departments</Link>
    <Link to="/admin/courses" className="btn-secondary">Courses</Link>
    <Link to="/admin/classes" className="btn-secondary">Classes</Link>
    <Link to="/admin/users" className="btn-secondary">Users</Link>
    <Link to="/admin/bulk-upload" className="btn-secondary">Bulk Upload</Link>
    <Link to="/admin/assign-teachers" className="btn-secondary">Assign Teachers</Link>
    <Link to="/admin/promote-crs" className="btn-secondary">Promote CRs</Link>
  </nav>
);

export default function AssignTeachers() {
  const queryClient = useQueryClient();
  const [assignments, setAssignments] = useState<Record<string, string>>({}); // local staging state
  const [pendingChanges, setPendingChanges] = useState<Set<string>>(new Set());

  // Fetch classes
  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClassesForAdmin,
  });

  // Fetch all users to filter teachers
  // Ideally, we'd have a specific endpoint for teachers, but filtering users works with current API
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsersForAdmin,
  });

  const teachers = users.filter((u: User) => u.role === "teacher");

  // Initialize assignments state from fetched classes
  // Note: This only runs when classes change. Ideally we sync local state with server state.
  // But for "staging" changes, we might want to separate them.
  // For simplicity, let's treat the Select as a direct action or staged action.
  // The UI implies a "Save" button, so we should stage changes.
  React.useEffect(() => {
    if (classes.length > 0) {
      const initialAssignments: Record<string, string> = {};
      classes.forEach(classItem => {
        if (classItem.teacherId) {
          initialAssignments[classItem.id] = classItem.teacherId;
        }
      });
      setAssignments(initialAssignments);
    }
  }, [classes]);

  const handleAssignmentChange = (classId: string, teacherId: string) => {
    setAssignments(prev => {
      const newAssignments = { ...prev };
      if (teacherId === "none") {
        delete newAssignments[classId];
      } else {
        newAssignments[classId] = teacherId;
      }
      return newAssignments;
    });
    setPendingChanges(prev => new Set(prev).add(classId));
  };

  const assignMutation = useMutation({
    mutationFn: async ({ classId, teacherId }: { classId: string, teacherId: string }) => {
      return assignTeachersToClass(classId, [teacherId]);
    },
  });

  const unassignMutation = useMutation({
    mutationFn: async ({ classId }: { classId: string }) => {
      // We need teacherId to unassign specific teacher, or maybe unassign generic?
      // The API unassignTeachersFromClass takes teacherIds array.
      // We need to know who was assigned.
      // If we select "none", we want to remove the CURRENTLY assigned teacher.
      // We can find that from the 'classes' data, NOT the 'assignments' state (which is new state).
      const currentClass = classes.find((c: Class) => c.id === classId);
      if (currentClass && currentClass.teacherId) {
        return unassignTeachersFromClass(classId, [currentClass.teacherId]);
      }
      return Promise.resolve(); // Nothing to unassign
    },
  });

  const handleSaveAssignments = async () => {
    // Process all pending changes
    // This logic is a bit complex: we need to iterate pending changes and call API.
    // For "none", call unassign. For valid ID, call assign.
    let successCount = 0;
    let failCount = 0;

    const changes = Array.from(pendingChanges);
    if (changes.length === 0) {
      toast({ title: "No changes", description: "No assignment changes to save." });
      return;
    }

    // Show loading toast or state handled by parent loading

    for (const classId of changes) {
      const teacherId = assignments[classId];
      try {
        if (!teacherId || teacherId === "none") {
          await unassignMutation.mutateAsync({ classId });
        } else {
          await assignMutation.mutateAsync({ classId, teacherId });
        }
        successCount++;
      } catch (err) {
        console.error(err);
        failCount++;
      }
    }

    setPendingChanges(new Set());
    queryClient.invalidateQueries({ queryKey: ["classes"] });

    if (failCount === 0) {
      toast({ title: "Assignments Saved", description: `Updated assignments for ${successCount} classes.` });
    } else {
      toast({
        title: "Partial Success",
        description: `Updated ${successCount} classes, failed ${failCount}.`,
        variant: "destructive"
      });
    }
  };

  const assignedCount = Object.keys(assignments).length;
  const totalClasses = classes.length;
  const loading = loadingClasses || loadingUsers || assignMutation.isPending || unassignMutation.isPending;

  return (
    <DashboardLayout
      title="Assign Teachers"
      description="Assign teachers to specific classes for the semester."
    >
      <QuickAdminNav />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-800">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Total Classes</p>
                  <h3 className="text-2xl font-bold text-white">{totalClasses}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-green-800">
                  <Users size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Assigned</p>
                  <h3 className="text-2xl font-bold text-white">{assignedCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-orange-600 to-orange-800">
                  <BookOpen size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Unassigned</p>
                  <h3 className="text-2xl font-bold text-white">{totalClasses - assignedCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assignment List */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Class Assignments</CardTitle>
              <Button
                onClick={handleSaveAssignments}
                disabled={loading || pendingChanges.size === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Assignments {pendingChanges.size > 0 && `(${pendingChanges.size})`}
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((classItem: Class) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                        {classItem.departmentCode}
                      </Badge>
                      <span className="text-white font-medium">
                        {classItem.courseName || `Course ${classItem.courseId}`} - Section {classItem.section}
                      </span>
                      <span className="text-white/60">({classItem.session})</span>
                    </div>
                    {classItem.courseCode && (
                      <p className="text-white/70 text-sm mt-1">
                        Course Code: {classItem.courseCode}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-64">
                      <Select
                        value={assignments[classItem.id] || "none"}
                        onValueChange={(value) => handleAssignmentChange(classItem.id, value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-white/10">
                          <SelectItem value="none" className="text-white">
                            No teacher assigned
                          </SelectItem>
                          {teachers
                            .filter((teacher: User) => !teacher.department || teacher.department.startsWith(classItem.departmentCode.split('-')[0]) || true) // Relaxed filter, or match by dept code prefix
                            .map((teacher: User) => (
                              <SelectItem key={teacher.id} value={teacher.id} className="text-white">
                                {teacher.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {assignments[classItem.id] && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-400">
                        Assigned
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
              {classes.length === 0 && !loading && (
                <p className="text-center text-white/50 py-4">No classes found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
