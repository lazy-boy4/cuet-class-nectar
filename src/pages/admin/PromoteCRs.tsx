
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Crown, Users, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { mockStudents } from "@/api/mockData/users";
import { mockClasses } from "@/api/mockData/classes";
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

export default function PromoteCRs() {
  const [crAssignments, setCrAssignments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Initialize with existing CRs
  React.useEffect(() => {
    const initialCRs: Record<string, string> = {};
    mockStudents.forEach(student => {
      if (student.isClassRepresentative) {
        // Find the class this CR belongs to
        const classKey = `${student.department}-${student.section}-${student.session}`;
        initialCRs[classKey] = student.id;
      }
    });
    setCrAssignments(initialCRs);
  }, []);

  const handleCRAssignment = (classKey: string, studentId: string, isAssigned: boolean) => {
    setCrAssignments(prev => {
      const newAssignments = { ...prev };
      if (isAssigned) {
        newAssignments[classKey] = studentId;
      } else {
        delete newAssignments[classKey];
      }
      return newAssignments;
    });
  };

  const handleSaveAssignments = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "CR Assignments Saved",
        description: "Class Representative assignments have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save CR assignments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Group students by class
  const classSections = mockClasses.reduce((acc, classItem) => {
    const key = `${classItem.departmentCode}-${classItem.section}-${classItem.session}`;
    if (!acc[key]) {
      acc[key] = {
        class: classItem,
        students: mockStudents.filter(
          student => 
            student.department === classItem.departmentCode &&
            student.section === classItem.section &&
            student.session === classItem.session
        )
      };
    }
    return acc;
  }, {} as Record<string, { class: any; students: any[] }>);

  const totalCRs = Object.keys(crAssignments).length;
  const totalClasses = Object.keys(classSections).length;

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
                  <h3 className="text-2xl font-bold text-white">{totalClasses}</h3>
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
                  <h3 className="text-2xl font-bold text-white">{totalCRs}</h3>
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
                  <h3 className="text-2xl font-bold text-white">{totalClasses - totalCRs}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
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
                Save CR Assignments
              </>
            )}
          </Button>
        </div>

        {/* CR Assignment by Class */}
        <div className="space-y-6">
          {Object.entries(classSections).map(([classKey, { class: classItem, students }]) => (
            <Card key={classKey} className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
                      {classItem.departmentCode}
                    </Badge>
                    <span>{classItem.courseName} - Section {classItem.section}</span>
                    <span className="text-white/60">({classItem.session})</span>
                  </div>
                  {crAssignments[classKey] && (
                    <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400">
                      <Crown size={12} className="mr-1" />
                      CR Assigned
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-white/70">No students enrolled in this class.</p>
                ) : (
                  <div className="space-y-3">
                    {students.map((student) => (
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
                            checked={crAssignments[classKey] === student.id}
                            onCheckedChange={(checked) => handleCRAssignment(classKey, student.id, checked)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
