import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Edit, Loader2, Plus, Search, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { mockDepartments } from "@/api/mockData/departments";
import { mockCourses } from "@/api/mockData/courses";
import { Class } from "@/types";

const ClassManagement = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  
  const [classToEdit, setClassToEdit] = useState<Class | null>(null);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);
  
  const [formData, setFormData] = useState({
    departmentCode: "",
    session: "",
    section: "",
    courseId: "",
  });
  
  const filteredClasses = mockClasses.filter((classItem) => {
    const searchMatch =
      classItem.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const departmentMatch = departmentFilter
      ? classItem.departmentCode === departmentFilter
      : true;
    
    const sessionMatch = sessionFilter
      ? classItem.session === sessionFilter
      : true;
    
    return searchMatch && departmentMatch && sessionMatch;
  });
  
  const sessions = Array.from(
    new Set(mockClasses.map((classItem) => classItem.session))
  );
  
  const handleAddClass = () => {
    setClassToEdit(null);
    setFormData({
      departmentCode: "",
      session: "",
      section: "",
      courseId: "",
    });
    setIsDialogOpen(true);
  };
  
  const handleEditClass = (classItem: Class) => {
    setClassToEdit(classItem);
    setFormData({
      departmentCode: classItem.departmentCode,
      session: classItem.session,
      section: classItem.section,
      courseId: classItem.courseId,
    });
    setIsDialogOpen(true);
  };
  
  const handleSubmit = async () => {
    if (!formData.departmentCode || !formData.session || !formData.section || !formData.courseId) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all fields.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (classToEdit) {
        toast({
          title: "Class Updated",
          description: "The class has been updated successfully.",
        });
      } else {
        toast({
          title: "Class Added",
          description: "The class has been added successfully.",
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save the class. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteClick = (classItem: Class) => {
    setClassToDelete(classItem);
    setIsAlertDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!classToDelete) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast({
        title: "Class Deleted",
        description: "The class has been deleted successfully.",
      });
      
      setIsAlertDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the class. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getCourseName = (courseId: string) => {
    const course = mockCourses.find((c) => c.id === courseId);
    return course ? `${course.code} - ${course.name}` : "Unknown Course";
  };
  
  const getDepartmentName = (departmentCode: string): string => {
    const department = mockDepartments.find((d) => d.id === departmentCode || d.code === departmentCode);
    return department ? department.name : "Unknown Department";
  };
  
  const filteredCourses = mockCourses.filter(
    (course) => !formData.departmentCode || course.departmentId === formData.departmentCode
  );
  
  return (
    <DashboardLayout
      title="Class Management"
      description="Create and manage classes for different courses, departments, and sessions"
    >
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 border-white/10"
          />
        </div>
        
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[200px] border-white/10">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Departments</SelectItem>
            {mockDepartments.map((dept) => (
              <SelectItem key={dept.id} value={dept.id}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sessionFilter} onValueChange={setSessionFilter}>
          <SelectTrigger className="w-[150px] border-white/10">
            <SelectValue placeholder="All Sessions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Sessions</SelectItem>
            {sessions.map((session) => (
              <SelectItem key={session} value={session}>
                {session}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="ml-auto">
          <Button onClick={handleAddClass}>
            <Plus className="mr-2 h-4 w-4" />
            Add Class
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border border-white/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Section</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{classItem.courseCode}</div>
                      <div className="text-sm text-white/70">{classItem.courseName}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getDepartmentName(classItem.departmentCode)}</TableCell>
                  <TableCell>{classItem.session}</TableCell>
                  <TableCell>{classItem.section}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClass(classItem)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(classItem)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <p className="text-white/70">No classes found.</p>
                  {(searchTerm || departmentFilter || sessionFilter) && (
                    <p className="text-sm text-white/50">
                      Try adjusting your search or filters.
                    </p>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{classToEdit ? "Edit Class" : "Add New Class"}</DialogTitle>
            <DialogDescription>
              {classToEdit
                ? "Update the class information below and click Save to apply changes."
                : "Fill in the class information below and click Add to create a new class."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="department" className="col-span-1 text-right text-sm">
                Department
              </label>
              <div className="col-span-3">
                <Select
                  value={formData.departmentCode}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departmentCode: value, courseId: "" })
                  }
                >
                  <SelectTrigger className="border-white/10">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="session" className="col-span-1 text-right text-sm">
                Session
              </label>
              <div className="col-span-3">
                <Input
                  id="session"
                  placeholder="E.g., 2023-24"
                  value={formData.session}
                  onChange={(e) =>
                    setFormData({ ...formData, session: e.target.value })
                  }
                  className="border-white/10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="section" className="col-span-1 text-right text-sm">
                Section
              </label>
              <div className="col-span-3">
                <Input
                  id="section"
                  placeholder="E.g., A, B, C"
                  value={formData.section}
                  onChange={(e) =>
                    setFormData({ ...formData, section: e.target.value })
                  }
                  className="border-white/10"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="course" className="col-span-1 text-right text-sm">
                Course
              </label>
              <div className="col-span-3">
                <Select
                  value={formData.courseId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, courseId: value })
                  }
                  disabled={!formData.departmentCode}
                >
                  <SelectTrigger className="border-white/10">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCourses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {classToEdit ? "Save Changes" : "Add Class"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class{" "}
              <span className="font-semibold">
                {classToDelete?.courseCode} - {classToDelete?.courseName}
              </span>{" "}
              and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ClassManagement;
