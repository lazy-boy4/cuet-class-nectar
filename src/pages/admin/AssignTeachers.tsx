
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserPlus, Trash2, Search, Check, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/api/mockData/users";
import { mockClasses } from "@/api/mockData/classes";

const AssignTeachers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isUnassignDialogOpen, setIsUnassignDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [teacherAssignments, setTeacherAssignments] = useState<any[]>([]);
  const [filteredAssignments, setFilteredAssignments] = useState<any[]>([]);
  
  // Assignment form
  const [formData, setFormData] = useState({
    teacherId: "",
    classId: "",
  });
  
  useEffect(() => {
    document.title = "Assign Teachers - CUET Class Management System";
    
    // Check if user is authenticated as admin
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/login");
    }
    
    // Initialize mock assignments
    // In a real app, this would come from an API
    const mockAssignments = mockClasses
      .filter(cls => cls.teacherId) // Only classes with assigned teachers
      .map(cls => {
        const teacher = mockUsers.find(user => user.id === cls.teacherId);
        return {
          id: `${cls.id}-${cls.teacherId}`,
          classId: cls.id,
          teacherId: cls.teacherId,
          courseCode: cls.courseCode,
          courseName: cls.courseName,
          section: cls.section,
          session: cls.session,
          teacherName: teacher ? teacher.name : "Unknown Teacher",
          departmentCode: cls.departmentCode,
        };
      });
    
    setTeacherAssignments(mockAssignments);
    setFilteredAssignments(mockAssignments);
  }, [navigate]);
  
  // Filter assignments when search term changes
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAssignments(teacherAssignments);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = teacherAssignments.filter(
      assignment =>
        assignment.courseCode.toLowerCase().includes(term) ||
        assignment.courseName.toLowerCase().includes(term) ||
        assignment.teacherName.toLowerCase().includes(term) ||
        assignment.departmentCode.toLowerCase().includes(term)
    );
    
    setFilteredAssignments(filtered);
  }, [searchTerm, teacherAssignments]);
  
  // Load teachers (only those with teacher role)
  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => mockUsers.filter(user => user.role === "teacher"),
  });
  
  // Load unassigned classes
  const { data: unassignedClasses = [] } = useQuery({
    queryKey: ["unassignedClasses", teacherAssignments],
    queryFn: () => {
      // Get IDs of classes that already have teachers
      const assignedClassIds = teacherAssignments.map(
        assignment => assignment.classId
      );
      
      // Return classes that don't have teachers assigned
      return mockClasses.filter(cls => !assignedClassIds.includes(cls.id));
    },
  });
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Assign a teacher to a class
  const handleAssignTeacher = () => {
    // Validation
    if (!formData.teacherId || !formData.classId) {
      toast({
        title: "Error",
        description: "Please select both a teacher and a class",
        variant: "destructive",
      });
      return;
    }
    
    // Check if this assignment already exists
    const exists = teacherAssignments.some(
      a => a.classId === formData.classId && a.teacherId === formData.teacherId
    );
    
    if (exists) {
      toast({
        title: "Error",
        description: "This teacher is already assigned to this class",
        variant: "destructive",
      });
      return;
    }
    
    // Get details for the new assignment
    const selectedTeacher = teachers.find(t => t.id === formData.teacherId);
    const selectedClass = unassignedClasses.find(c => c.id === formData.classId);
    
    if (!selectedTeacher || !selectedClass) {
      toast({
        title: "Error",
        description: "Could not find teacher or class details",
        variant: "destructive",
      });
      return;
    }
    
    // Create new assignment
    const newAssignment = {
      id: `${selectedClass.id}-${selectedTeacher.id}`,
      classId: selectedClass.id,
      teacherId: selectedTeacher.id,
      courseCode: selectedClass.courseCode,
      courseName: selectedClass.courseName,
      section: selectedClass.section,
      session: selectedClass.session,
      teacherName: selectedTeacher.name,
      departmentCode: selectedClass.departmentCode,
    };
    
    // Add to assignments
    const updatedAssignments = [...teacherAssignments, newAssignment];
    setTeacherAssignments(updatedAssignments);
    setFilteredAssignments(updatedAssignments);
    
    // In a real app, we would call an API here
    toast({
      title: "Success",
      description: `${selectedTeacher.name} has been assigned to ${selectedClass.courseCode} (Section ${selectedClass.section})`,
    });
    
    // Reset form and close dialog
    setFormData({
      teacherId: "",
      classId: "",
    });
    setIsAssignDialogOpen(false);
  };
  
  // Unassign a teacher from a class
  const handleUnassignTeacher = () => {
    if (!selectedAssignment) return;
    
    // Remove from assignments
    const updatedAssignments = teacherAssignments.filter(
      a => a.id !== selectedAssignment.id
    );
    setTeacherAssignments(updatedAssignments);
    setFilteredAssignments(updatedAssignments);
    
    // In a real app, we would call an API here
    toast({
      title: "Success",
      description: `${selectedAssignment.teacherName} has been unassigned from ${selectedAssignment.courseCode} (Section ${selectedAssignment.section})`,
    });
    
    setIsUnassignDialogOpen(false);
  };
  
  // Open unassign dialog
  const openUnassignDialog = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsUnassignDialogOpen(true);
  };

  return (
    <DashboardLayout
      title="Assign Teachers"
      description="Assign teachers to class sections"
    >
      {/* Search and action buttons */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <Input
            placeholder="Search for assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>
        <Button 
          onClick={() => setIsAssignDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Assign Teacher
        </Button>
      </div>

      {/* Assignments Table */}
      <div className="reveal rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-white">Course</TableHead>
              <TableHead className="text-white">Section</TableHead>
              <TableHead className="text-white">Session</TableHead>
              <TableHead className="text-white">Department</TableHead>
              <TableHead className="text-white">Teacher</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssignments.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-white/70"
                >
                  No teacher assignments found
                </TableCell>
              </TableRow>
            ) : (
              filteredAssignments.map((assignment) => (
                <TableRow 
                  key={assignment.id} 
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="font-medium text-white">
                    {assignment.courseCode}: {assignment.courseName}
                  </TableCell>
                  <TableCell className="text-white">
                    {assignment.section}
                  </TableCell>
                  <TableCell className="text-white">
                    {assignment.session}
                  </TableCell>
                  <TableCell className="text-white">
                    {assignment.departmentCode}
                  </TableCell>
                  <TableCell className="text-white">
                    {assignment.teacherName}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openUnassignDialog(assignment)}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Assign Teacher Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="bg-cuet-navy border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Assign Teacher to Class</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="teacher" className="text-white">
                Teacher
              </Label>
              <Select
                value={formData.teacherId}
                onValueChange={(value) => handleSelectChange("teacherId", value)}
              >
                <SelectTrigger id="teacher" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="class" className="text-white">
                Class
              </Label>
              <Select
                value={formData.classId}
                onValueChange={(value) => handleSelectChange("classId", value)}
              >
                <SelectTrigger id="class" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {unassignedClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.courseCode}: {cls.courseName} (Section {cls.section})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAssignTeacher}
              className="bg-gradient-to-r from-blue-600 to-blue-800"
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unassign Confirmation Dialog */}
      <AlertDialog open={isUnassignDialogOpen} onOpenChange={setIsUnassignDialogOpen}>
        <AlertDialogContent className="bg-cuet-navy border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Unassign Teacher
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unassign{" "}
              <span className="font-medium text-white">
                {selectedAssignment?.teacherName}
              </span>{" "}
              from{" "}
              <span className="font-medium text-white">
                {selectedAssignment?.courseCode} (Section {selectedAssignment?.section})?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnassignTeacher}
              className="bg-red-600 hover:bg-red-700 text-white"
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
