
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Crown, Users, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsersForAdmin, fetchClassesForAdmin, promoteStudentToCR, demoteCRToStudent } from "@/api/admin";
import { User, Class } from "@/types";

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

export default function PromoteCRs() {
  const queryClient = useQueryClient();
  const [crChanges, setCrChanges] = useState<Record<string, { studentId: string, action: 'promote' | 'demote' }>>({});

  // Fetch users and classes
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsersForAdmin,
  });

  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClassesForAdmin,
  });

  // Filter students
  const students = users.filter((u: User) => u.role === "student" || u.role === "cr");
  const currentCRs = users.filter((u: User) => u.role === "cr");

  const promoteMutation = useMutation({
    mutationFn: promoteStudentToCR,
  });

  const demoteMutation = useMutation({
    mutationFn: demoteCRToStudent,
  });

  // Group students by class logic
  // Students likely have department/session/section fields. Classes have departmentCode/session/section.
  // We match them up.
  const classSections = classes.reduce((acc: any, classItem: Class) => {
    const key = `${classItem.departmentCode}-${classItem.section}-${classItem.session}`;
    // Avoid duplicate keys if multiple courses occupy same section, just group once per section
    if (!acc[key]) {
      acc[key] = {
        class: classItem,
        students: students.filter((student: User) =>
          // flexible matching: dept code match or prefix match
          (student.department === classItem.departmentCode || classItem.departmentCode.startsWith(student.department || '')) &&
          student.section === classItem.section &&
          student.session === classItem.session
        )
      };
    }
    return acc;
  }, {} as Record<string, { class: Class; students: User[] }>);


  // Handle toggle logic
  // If student is NOT CR -> Promoted. Change state: studentId -> promote
  // If student IS CR -> Demote. Change state: studentId -> demote
  // If toggled back to original state, remove from changes.
  const handleToggleCR = (studentId: string, isCurrentCR: boolean) => {
    setCrChanges(prev => {
      const newChanges = { ...prev };

      if (newChanges[studentId]) {
        // Reverting a pending change
        delete newChanges[studentId];
      } else {
        // Adding a new change
        newChanges[studentId] = {
          studentId,
          action: isCurrentCR ? 'demote' : 'promote'
        };
      }
      return newChanges;
    });
  };

  const activeCRsCount = currentCRs.length;
  // Adjusted by pending changes for display? A bit complex. Let's just use raw data for top stats.

  const handleSaveAssignments = async () => {
    let successCount = 0;
    let failCount = 0;
    const changes = Object.values(crChanges);

    if (changes.length === 0) return;

    for (const change of changes) {
      try {
        if (change.action === 'promote') {
          await promoteMutation.mutateAsync(change.studentId);
        } else {
          await demoteMutation.mutateAsync(change.studentId);
        }
        successCount++;
      } catch (err) {
        console.error(err);
        failCount++;
      }
    }

    setCrChanges({});
    queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresh users list to update roles

    if (failCount === 0) {
      toast({ title: "Updated CRs", description: `Successfully updated ${successCount} Class Representatives.` });
    } else {
      toast({ title: "Partial Update", description: `Updated ${successCount}, failed ${failCount}.`, variant: "destructive" });
    }
  };

  const loading = loadingClasses || loadingUsers || promoteMutation.isPending || demoteMutation.isPending;

  return (
    <DashboardLayout
      title="Promote Class Representatives"
      description="Designate class representatives for each class section."
    >
      <QuickAdminNav />

      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-800">
                  <Users size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Total Classes</p>
                  <h3 className="text-2xl font-bold text-white">{classes.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-800">
                  <Crown size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Active CRs</p>
                  <h3 className="text-2xl font-bold text-white">{activeCRsCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-red-800">
                  <Users size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">Need CRs</p>
                  <h3 className="text-2xl font-bold text-white">{Object.keys(classSections).length - activeCRsCount}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSaveAssignments}
            disabled={loading || Object.keys(crChanges).length === 0}
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
                Save CR Assignments {Object.keys(crChanges).length > 0 && `(${Object.keys(crChanges).length})`}
              </>
            )}
          </Button>
        </div>

        {/* CR Assignment by Class */}
        <div className="space-y-6">
          {Object.entries(classSections).map(([classKey, { class: classItem, students }]: [string, any]) => {
            // Determine if any student in this class is a CR (either already, or pending)
            const hasCr = students.some((s: User) => {
              const pending = crChanges[s.id];
              if (pending) return pending.action === 'promote';
              return s.role === 'cr' && (!pending || pending.action !== 'demote');
            });

            return (
              <Card key={classKey} className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                        {classItem.departmentCode}
                      </Badge>
                      <span>{classItem.courseName || `Section ${classItem.section}`}</span>
                      <span className="text-white/60">({classItem.session})</span>
                    </div>
                    {hasCr && (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
                        <Crown size={12} className="mr-1" />
                        CR Assigned
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {students.length === 0 ? (
                    <p className="text-white/70">No students found matching Dept/Session/Section.</p>
                  ) : (
                    <div className="space-y-3">
                      {students.map((student: User) => {
                        const isPending = !!crChanges[student.id];
                        const isCr = student.role === 'cr' || student.isClassRepresentative; // Backend mapping should standardise this
                        // Determine visual checked state:
                        // If pending promote -> true
                        // If pending demote -> false
                        // If no pending -> current state
                        let isChecked = isCr;
                        if (isPending) {
                          isChecked = crChanges[student.id].action === 'promote';
                        }

                        return (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5"
                          >
                            <div className="flex items-center space-x-3">
                              {student.profileImage ? (
                                <img
                                  src={student.profileImage}
                                  alt={student.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm">
                                  {student.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <p className="text-white font-medium">{student.name}</p>
                                <p className="text-white/60 text-sm">{student.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-white/70 text-sm">Make CR</span>
                              <Switch
                                checked={!!isChecked}
                                onCheckedChange={() => handleToggleCR(student.id, !!isCr)}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
