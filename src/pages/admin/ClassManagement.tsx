
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
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
  const [classes, setClasses] = useState<Class[]>(mockClasses);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<Class | null>(null);
  const [classToDelete, setClassToDelete] = useState<Class | null>(null);

  // Form data for new or edited class
  const [formData, setFormData] = useState({
    department: "",
    courseId: "",
    session: "",
    section: "",
  });

  // Filter classes based on search term and department
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearchTerm =
      classItem.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter 
      ? classItem.department === departmentFilter 
      : true;
    
    return matchesSearchTerm && matchesDepartment;
  });

  // Reset form data when dialog closes
  useEffect(() => {
    if (!isAddClassOpen && !isEditClassOpen) {
      setFormData({
        department: "",
        courseId: "",
        session: "",
        section: "",
      });
      setClassToEdit(null);
    }
  }, [isAddClassOpen, isEditClassOpen]);

  // Set form data when editing a class
  useEffect(() => {
    if (classToEdit) {
      const courseId = mockCourses.find(course => course.code === classToEdit.courseCode)?.id || "";
      
      setFormData({
        department: classToEdit.department,
        courseId: courseId,
        session: classToEdit.session,
        section: classToEdit.section,
      });
    }
  }, [classToEdit]);

  // Handle input change for form fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select change for dropdown fields
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit for adding or editing a class
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.department || !formData.courseId || !formData.session || !formData.section) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Find the selected course
    const selectedCourse = mockCourses.find(course => course.id === formData.courseId);
    if (!selectedCourse) {
      toast({
        title: "Error",
        description: "Selected course not found.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate class code (e.g., CSE-101-A)
    const classCode = `${selectedCourse.code}-${formData.section}`;
    
    if (classToEdit) {
      // Update existing class
      const updatedClasses = classes.map(classItem => 
        classItem.id === classToEdit.id
          ? {
              ...classItem,
              courseCode: selectedCourse.code,
              courseName: selectedCourse.name,
              department: formData.department,
              session: formData.session,
              section: formData.section,
              classCode: classCode,
            }
          : classItem
      );
      
      setClasses(updatedClasses);
      setIsEditClassOpen(false);
      
      toast({
        title: "Class Updated",
        description: `Class ${classCode} has been updated successfully.`,
      });
    } else {
      // Create new class
      const newClass: Class = {
        id: `class-${Date.now()}`,
        courseCode: selectedCourse.code,
        courseName: selectedCourse.name,
        department: formData.department,
        session: formData.session,
        section: formData.section,
        classCode: classCode,
      };
      
      setClasses([...classes, newClass]);
      setIsAddClassOpen(false);
      
      toast({
        title: "Class Created",
        description: `Class ${classCode} has been created successfully.`,
      });
    }
  };

  // Handle delete class
  const handleDeleteClass = () => {
    if (!classToDelete) return;
    
    const updatedClasses = classes.filter(
      (classItem) => classItem.id !== classToDelete.id
    );
    
    setClasses(updatedClasses);
    setIsDeleteDialogOpen(false);
    setClassToDelete(null);
    
    toast({
      title: "Class Deleted",
      description: `Class ${classToDelete.classCode} has been deleted.`,
    });
  };

  // Get courses filtered by department
  const getFilteredCourses = () => {
    if (!formData.department) return mockCourses;
    return mockCourses.filter(course => {
      const courseDept = mockDepartments.find(d => d.name === formData.department);
      return courseDept && course.department === courseDept.code;
    });
  };

  return (
    <DashboardLayout
      title="Class Management"
      description="Manage class sessions for courses"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by course name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm border-white/10"
          />
          <Select
            value={departmentFilter}
            onValueChange={setDepartmentFilter}
          >
            <SelectTrigger className="w-[180px] border-white/10">
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
        <Button onClick={() => setIsAddClassOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px] text-white/70">Class Code</TableHead>
              <TableHead className="w-[120px] text-white/70">Course Code</TableHead>
              <TableHead className="text-white/70">Course Name</TableHead>
              <TableHead className="text-white/70">Department</TableHead>
              <TableHead className="text-white/70">Session</TableHead>
              <TableHead className="text-white/70">Section</TableHead>
              <TableHead className="text-right text-white/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length > 0 ? (
              filteredClasses.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-mono font-medium">
                    {classItem.classCode}
                  </TableCell>
                  <TableCell>{classItem.courseCode}</TableCell>
                  <TableCell className="font-medium text-white">
                    {classItem.courseName}
                  </TableCell>
                  <TableCell>{classItem.department}</TableCell>
                  <TableCell>{classItem.session}</TableCell>
                  <TableCell>{classItem.section}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:bg-white/10 hover:text-white"
                      onClick={() => {
                        setClassToEdit(classItem);
                        setIsEditClassOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:bg-red-900/20 hover:text-red-400"
                      onClick={() => {
                        setClassToDelete(classItem);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <p className="text-white/70">No classes found.</p>
                  <p className="text-sm text-white/50">
                    Try adjusting your search or filter.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Class Dialog */}
      <Dialog 
        open={isAddClassOpen || isEditClassOpen} 
        onOpenChange={(open) => {
          if (isAddClassOpen) setIsAddClassOpen(open);
          if (isEditClassOpen) setIsEditClassOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditClassOpen ? "Edit Class" : "Add Class"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="courseId" className="text-sm font-medium">
                Course
              </label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => handleSelectChange("courseId", value)}
                disabled={!formData.department}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.department ? "Select a course" : "Select department first"} />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredCourses().map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code}: {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="session" className="text-sm font-medium">
                Session
              </label>
              <Input
                id="session"
                name="session"
                placeholder="e.g., 2023-24"
                value={formData.session}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="section" className="text-sm font-medium">
                Section
              </label>
              <Input
                id="section"
                name="section"
                placeholder="e.g., A"
                value={formData.section}
                onChange={handleInputChange}
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                {isEditClassOpen ? "Update Class" : "Add Class"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {classToDelete?.classCode}: {classToDelete?.courseName}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteClass}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default ClassManagement;
