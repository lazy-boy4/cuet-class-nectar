
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
import { mockClasses } from "@/api/mockData/classes";
import { mockTeachers } from "@/api/mockData/users";
import { toast } from "@/hooks/use-toast";

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
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Initialize assignments with existing teacher assignments
  React.useEffect(() => {
    const initialAssignments: Record<string, string> = {};
    mockClasses.forEach(classItem => {
      if (classItem.teacherId) {
        initialAssignments[classItem.id] = classItem.teacherId;
      }
    });
    setAssignments(initialAssignments);
  }, []);

  const handleAssignment = (classId: string, teacherId: string) => {
    setAssignments(prev => ({
      ...prev,
      [classId]: teacherId
    }));
  };

  const handleSaveAssignments = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Assignments Saved",
        description: "Teacher assignments have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save teacher assignments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = mockTeachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : "Unknown Teacher";
  };

  const assignedCount = Object.keys(assignments).length;
  const totalClasses = mockClasses.length;

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
                disabled={loading}
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
                    Save Assignments
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockClasses.map((classItem) => (
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
                        {classItem.courseName} - Section {classItem.section}
                      </span>
                      <span className="text-white/60">({classItem.session})</span>
                    </div>
                    <p className="text-white/70 text-sm mt-1">
                      Course Code: {classItem.courseCode}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-64">
                      <Select
                        value={assignments[classItem.id] || ""}
                        onValueChange={(value) => handleAssignment(classItem.id, value)}
                      >
                        <SelectTrigger className="bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-white/10">
                          <SelectItem value="" className="text-white">
                            No teacher assigned
                          </SelectItem>
                          {mockTeachers
                            .filter(teacher => teacher.department === classItem.departmentCode)
                            .map((teacher) => (
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
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
