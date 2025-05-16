import React, { useState } from "react";
import { Link } from "react-router-dom"; // <-- Fix: Import Link
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Search, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockClasses } from "@/api/mockData/classes";
import { mockUsers } from "@/api/mockData/users";
import { mockDepartments } from "@/api/mockData/departments";
import { Class, User } from "@/types";

// Mock assignments - in a real app, this would come from an API
const mockAssignments = [{
  id: "assign-1",
  teacherId: "user-105",
  classId: "class-101",
  assignedAt: new Date(2023, 5, 10)
}, {
  id: "assign-2",
  teacherId: "user-106",
  classId: "class-102",
  assignedAt: new Date(2023, 5, 12)
}, {
  id: "assign-3",
  teacherId: "user-107",
  classId: "class-103",
  assignedAt: new Date(2023, 5, 15)
}];
const QuickAdminNav = () => <nav className="mb-8 flex flex-wrap gap-3">
    <Link to="/admin/dashboard" className="btn-secondary">Dashboard</Link>
    <Link to="/admin/departments" className="btn-secondary">Departments</Link>
    <Link to="/admin/courses" className="btn-secondary">Courses</Link>
    <Link to="/admin/classes" className="btn-secondary">Classes</Link>
    <Link to="/admin/users" className="btn-secondary">Users</Link>
    <Link to="/admin/assign-teachers" className="btn-secondary">Assign Teachers</Link>
    <Link to="/admin/promote-crs" className="btn-secondary">Promote CRs</Link>
  </nav>;
const AssignTeachers = () => {
  const {
    toast
  } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
  const [classSearchTerm, setClassSearchTerm] = useState("");
  // Change initial value to "all"
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // State for teacher-class assignments
  const [assignments, setAssignments] = useState(mockAssignments);

  // Form state for new assignment
  const [formData, setFormData] = useState({
    teacherId: "",
    classId: ""
  });

  // Filter teachers based on search term and role
  const teachers = mockUsers.filter(user => user.role === "teacher" && (user.name.toLowerCase().includes(teacherSearchTerm.toLowerCase()) || user.email.toLowerCase().includes(teacherSearchTerm.toLowerCase())));

  // Filter classes based on search term and department filter
  const classes = mockClasses.filter(classItem => {
    const searchMatch = classItem.courseCode.toLowerCase().includes(classSearchTerm.toLowerCase()) || classItem.courseName.toLowerCase().includes(classSearchTerm.toLowerCase());

    // If departmentFilter is "all", don't filter by department
    const departmentMatch = departmentFilter !== "all" ? classItem.departmentCode === departmentFilter : true;
    return searchMatch && departmentMatch;
  });

  // Handle opening the dialog for adding a new assignment
  const handleAddAssignment = () => {
    setFormData({
      teacherId: "",
      classId: ""
    });
    setIsDialogOpen(true);
  };

  // Handle form submission for adding a new assignment
  const handleSubmit = async () => {
    // Validate form data
    if (!formData.teacherId || !formData.classId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select both a teacher and a class."
      });
      return;
    }

    // Check if assignment already exists
    const isDuplicate = assignments.some(assignment => assignment.teacherId === formData.teacherId && assignment.classId === formData.classId);
    if (isDuplicate) {
      toast({
        variant: "destructive",
        title: "Duplicate Assignment",
        description: "This teacher is already assigned to this class."
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // In a real app, this would make an API call to save the data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Add new assignment to state
      const newAssignment = {
        id: `assign-${Date.now()}`,
        teacherId: formData.teacherId,
        classId: formData.classId,
        assignedAt: new Date()
      };
      setAssignments([...assignments, newAssignment]);
      toast({
        title: "Teacher Assigned",
        description: "The teacher has been successfully assigned to the class."
      });

      // Close dialog
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign the teacher. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle unassigning a teacher from a class
  const handleUnassign = async (assignmentId: string) => {
    setIsSubmitting(true);
    try {
      // In a real app, this would make an API call to delete the data
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Remove assignment from state
      setAssignments(assignments.filter(a => a.id !== assignmentId));
      toast({
        title: "Teacher Unassigned",
        description: "The teacher has been successfully unassigned from the class."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to unassign the teacher. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get teacher name by ID
  const getTeacherName = (teacherId: string) => {
    const teacher = mockUsers.find(user => user.id === teacherId);
    return teacher ? teacher.name : "Unknown Teacher";
  };

  // Get class details by ID
  const getClassDetails = (classId: string) => {
    const classItem = mockClasses.find(c => c.id === classId);
    return classItem ? {
      courseCode: classItem.courseCode,
      courseName: classItem.courseName,
      departmentCode: classItem.departmentCode,
      session: classItem.session,
      section: classItem.section
    } : {
      courseCode: "Unknown",
      courseName: "Unknown",
      departmentCode: "",
      session: "",
      section: ""
    };
  };

  // Get department name from ID
  const getDepartmentName = (departmentCode: string): string => {
    const department = mockDepartments.find(d => d.id === departmentCode || d.code === departmentCode);
    return department ? department.name : departmentCode;
  };
  return <DashboardLayout title="Assign Teachers" description="Assign teachers to specific classes">
      <QuickAdminNav />
      {/* Search and Add Button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search assignments..." value={teacherSearchTerm} onChange={e => setTeacherSearchTerm(e.target.value)} className="pl-10 border-white/10" />
        </div>
        
        <Button onClick={handleAddAssignment} className="font-medium">
          <Plus className="mr-2 h-4 w-4" />
          Add Assignment
        </Button>
      </div>
      
      {/* Assignments Table */}
      <div className="rounded-md border border-white/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Session & Section</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length > 0 ? assignments.map(assignment => {
            const classDetails = getClassDetails(assignment.classId);
            return <TableRow key={assignment.id}>
                    <TableCell>
                      <div className="font-medium text-white">
                        {getTeacherName(assignment.teacherId)}
                      </div>
                      <div className="text-sm text-white/60">
                        {mockUsers.find(u => u.id === assignment.teacherId)?.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-white">
                        {classDetails.courseCode}
                      </div>
                      <div className="text-sm text-white/60">
                        {classDetails.courseName}
                      </div>
                    </TableCell>
              <TableCell>
  {getDepartmentName(classDetails.departmentCode)} {/* Changed from departmentId to departmentCode */}
              </TableCell>
                    <TableCell>
                      {classDetails.session}, Section {classDetails.section}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleUnassign(assignment.id)} disabled={isSubmitting}>
                        <X className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Unassign</span>
                      </Button>
                    </TableCell>
                  </TableRow>;
          }) : <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <p className="text-white/70">No teacher assignments found.</p>
                  <p className="text-sm text-white/50">
                    Click "Add Assignment" to assign teachers to classes.
                  </p>
                </TableCell>
              </TableRow>}
          </TableBody>
        </Table>
      </div>
      
      {/* Add Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Assign Teacher to Class</DialogTitle>
            <DialogDescription>
              Select a teacher and a class to create a new assignment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <label htmlFor="teacher" className="text-sm font-medium">
                Teacher
              </label>
              <div className="space-y-2">
                <Input placeholder="Search teachers..." value={teacherSearchTerm} onChange={e => setTeacherSearchTerm(e.target.value)} className="border-white/10" />
                <Select value={formData.teacherId} onValueChange={value => setFormData({
                ...formData,
                teacherId: value
              })}>
                  <SelectTrigger className="border-white/10">
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.length > 0 ? teachers.map(teacher => <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.name} ({teacher.email})
                        </SelectItem>) : <div className="p-2 text-center text-sm text-white/60">
                        No teachers found. Try adjusting your search.
                      </div>}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Class</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input placeholder="Search classes..." value={classSearchTerm} onChange={e => setClassSearchTerm(e.target.value)} className="border-white/10" />
                  <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                    <SelectTrigger className="w-[180px] border-white/10">
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Use "all" instead of "" */}
                      <SelectItem value="all">All Departments</SelectItem>
                      {mockDepartments.map(dept => <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Select value={formData.classId} onValueChange={value => setFormData({
                ...formData,
                classId: value
              })}>
                  <SelectTrigger className="border-white/10">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                  {classes.length > 0 ? classes.map((classItem: Class) => {
                    const departmentName = getDepartmentName(classItem.departmentCode); // Changed from departmentId to departmentCode
                    return <SelectItem key={classItem.id} value={classItem.id}>
        {classItem.courseCode} - {departmentName}, {classItem.session}
      </SelectItem>;
                  }) : <div className="p-2 text-center text-sm text-white/60">
    No classes found. Try adjusting your search or filter.
  </div>}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>;
};
export default AssignTeachers;