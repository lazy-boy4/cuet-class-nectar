
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Search, Trash2, UserCheck } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockClasses } from "@/api/mockData/classes";
import { mockUsers } from "@/api/mockData/users";
import { mockDepartments } from "@/api/mockData/departments";
import { Class, User } from "@/types";

// Define our assignment type
interface Assignment {
  id: string;
  teacherId: string;
  classId: string;
  assignedAt: string;
}

const AssignTeachers = () => {
  const { toast } = useToast();
  
  // States for data
  const [teachers, setTeachers] = useState<User[]>(
    mockUsers.filter(user => user.role === "teacher")
  );
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // States for filtering
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
  const [classSearchTerm, setClassSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  
  // States for assignment form
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  
  // States for the alert dialog
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  
  // Generate some mock assignments on component mount
  useEffect(() => {
    if (teachers.length > 0 && classes.length > 0) {
      const initialAssignments: Assignment[] = [
        {
          id: "assign-1",
          teacherId: teachers[0].id,
          classId: classes[0].id,
          assignedAt: new Date().toISOString(),
        },
        {
          id: "assign-2",
          teacherId: teachers.length > 1 ? teachers[1].id : teachers[0].id,
          classId: classes.length > 1 ? classes[1].id : classes[0].id,
          assignedAt: new Date().toISOString(),
        },
      ];
      
      setAssignments(initialAssignments);
    }
  }, [teachers, classes]);
  
  // Filter teachers based on search term and department filter
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearchTerm = teacherSearchTerm === "" || 
      teacher.name.toLowerCase().includes(teacherSearchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "" || 
      teacher.department === departmentFilter;
    
    return matchesSearchTerm && matchesDepartment;
  });
  
  // Filter classes based on search term and department filter
  const filteredClasses = classes.filter(classItem => {
    const matchesSearchTerm = classSearchTerm === "" || 
      classItem.courseName.toLowerCase().includes(classSearchTerm.toLowerCase()) || 
      classItem.courseCode.toLowerCase().includes(classSearchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "" || 
      classItem.department === departmentFilter;
    
    return matchesSearchTerm && matchesDepartment;
  });
  
  // Check if a class is already assigned to a teacher
  const isClassAssigned = (classId: string) => {
    return assignments.some(assignment => assignment.classId === classId);
  };
  
  // Get teacher for a class assignment
  const getTeacherForClass = (classId: string) => {
    const assignment = assignments.find(a => a.classId === classId);
    if (assignment) {
      return teachers.find(t => t.id === assignment.teacherId);
    }
    return null;
  };
  
  // Handle assign teacher to class
  const handleAssign = () => {
    if (!selectedTeacherId || !selectedClassId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both a teacher and a class.",
      });
      return;
    }
    
    // Check if the class is already assigned
    if (isClassAssigned(selectedClassId)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "This class is already assigned to a teacher.",
      });
      return;
    }
    
    // Create new assignment
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      teacherId: selectedTeacherId,
      classId: selectedClassId,
      assignedAt: new Date().toISOString(),
    };
    
    setAssignments([...assignments, newAssignment]);
    
    // Reset selections
    setSelectedTeacherId("");
    setSelectedClassId("");
    
    // Show success toast
    const teacher = teachers.find(t => t.id === selectedTeacherId);
    const classInfo = classes.find(c => c.id === selectedClassId);
    
    toast({
      title: "Teacher Assigned",
      description: `${teacher?.name} has been assigned to ${classInfo?.courseName} (${classInfo?.classCode}).`,
    });
  };
  
  // Handle unassign
  const handleUnassign = () => {
    if (!assignmentToDelete) return;
    
    setAssignments(assignments.filter(a => a.id !== assignmentToDelete.id));
    setIsAlertDialogOpen(false);
    setAssignmentToDelete(null);
    
    // Show success toast
    const teacher = teachers.find(t => t.id === assignmentToDelete.teacherId);
    const classInfo = classes.find(c => c.id === assignmentToDelete.classId);
    
    toast({
      title: "Teacher Unassigned",
      description: `${teacher?.name} has been unassigned from ${classInfo?.courseName} (${classInfo?.classCode}).`,
    });
  };
  
  return (
    <DashboardLayout
      title="Assign Teachers"
      description="Assign teachers to specific classes"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left column - Assignment Form */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Create Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Department</label>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="border-white/10">
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Departments</SelectItem>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="teacher" className="text-sm font-medium">
                  Select Teacher
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/50" />
                    <Input
                      placeholder="Search teachers..."
                      value={teacherSearchTerm}
                      onChange={(e) => setTeacherSearchTerm(e.target.value)}
                      className="pl-8 border-white/10"
                    />
                  </div>
                  <Select
                    value={selectedTeacherId}
                    onValueChange={setSelectedTeacherId}
                  >
                    <SelectTrigger className="border-white/10">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="class" className="text-sm font-medium">
                  Select Class
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/50" />
                    <Input
                      placeholder="Search classes..."
                      value={classSearchTerm}
                      onChange={(e) => setClassSearchTerm(e.target.value)}
                      className="pl-8 border-white/10"
                    />
                  </div>
                  <Select
                    value={selectedClassId}
                    onValueChange={setSelectedClassId}
                  >
                    <SelectTrigger className="border-white/10">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredClasses
                        .filter(classItem => !isClassAssigned(classItem.id))
                        .map((classItem) => (
                          <SelectItem key={classItem.id} value={classItem.id}>
                            {classItem.classCode}: {classItem.courseName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button
                  onClick={handleAssign}
                  disabled={!selectedTeacherId || !selectedClassId}
                  className="w-full"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Assign Teacher to Class
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right column - Current Assignments */}
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments.length > 0 ? (
                    assignments.map((assignment) => {
                      const classInfo = classes.find(c => c.id === assignment.classId);
                      const teacher = teachers.find(t => t.id === assignment.teacherId);
                      
                      if (!classInfo || !teacher) return null;
                      
                      return (
                        <TableRow key={assignment.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-white">
                                {classInfo.courseName}
                              </p>
                              <p className="text-xs text-white/60">
                                {classInfo.classCode} ({classInfo.department})
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-white">
                                {teacher.name}
                              </p>
                              <p className="text-xs text-white/60">
                                {teacher.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:bg-red-900/20 hover:text-red-400"
                              onClick={() => {
                                setAssignmentToDelete(assignment);
                                setIsAlertDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Unassign</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        <p className="text-white/70">
                          No assignments found.
                        </p>
                        <p className="text-sm text-white/50">
                          Use the form to assign teachers to classes.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Class list with assigned teachers */}
      <Card className="mt-6 border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Class Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border border-white/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Class Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead className="text-right">Assigned Teacher</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((classItem) => {
                  const assignedTeacher = getTeacherForClass(classItem.id);
                  
                  return (
                    <TableRow key={classItem.id}>
                      <TableCell className="font-mono font-medium">
                        {classItem.classCode}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {classItem.courseName}
                      </TableCell>
                      <TableCell>{classItem.department}</TableCell>
                      <TableCell>{classItem.session}</TableCell>
                      <TableCell className="text-right">
                        {assignedTeacher ? (
                          <span className="inline-flex items-center text-green-400">
                            <UserCheck className="mr-1 h-4 w-4" />
                            {assignedTeacher.name}
                          </span>
                        ) : (
                          <span className="text-white/50">Not assigned</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Unassign Confirmation Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the teacher assignment from this class.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUnassign}
              className="bg-red-600 hover:bg-red-700"
            >
              Unassign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default AssignTeachers;
