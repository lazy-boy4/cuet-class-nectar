
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Pencil, Trash2, Filter } from "lucide-react";
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
import { mockClasses } from "@/api/mockData/classes";
import { mockDepartments } from "@/api/mockData/departments";
import { mockCourses } from "@/api/mockData/courses";

const ClassManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filteredClasses, setFilteredClasses] = useState(mockClasses);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form fields
  const [formData, setFormData] = useState({
    departmentId: "",
    session: "",
    section: "",
    courseId: ""
  });
  
  useEffect(() => {
    document.title = "Class Management - CUET Class Management System";
    
    // Check if user is authenticated as admin
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);
  
  // Filter classes when department filter or search term changes
  useEffect(() => {
    let filtered = [...mockClasses];
    
    if (departmentFilter !== "all") {
      filtered = filtered.filter(cls => cls.departmentCode === departmentFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        cls => 
          cls.courseCode.toLowerCase().includes(term) ||
          cls.courseName.toLowerCase().includes(term) ||
          cls.section.toLowerCase().includes(term) ||
          cls.session.toLowerCase().includes(term)
      );
    }
    
    setFilteredClasses(filtered);
  }, [departmentFilter, searchTerm]);
  
  // Load departments
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => mockDepartments,
  });
  
  // Load courses
  const { data: courses = [] } = useQuery({
    queryKey: ["courses"],
    queryFn: () => mockCourses,
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle adding a new class
  const handleAddClass = () => {
    // Validation
    if (!formData.departmentId || !formData.courseId || !formData.session || !formData.section) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would call an API here
    // For now, we'll just show a success message
    toast({
      title: "Success",
      description: "Class added successfully!",
    });
    
    // Reset form and close dialog
    setFormData({
      departmentId: "",
      courseId: "",
      session: "",
      section: ""
    });
    setIsAddDialogOpen(false);
  };
  
  // Handle editing a class
  const handleEditClass = () => {
    // Validation
    if (!formData.departmentId || !formData.courseId || !formData.session || !formData.section) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would call an API here
    toast({
      title: "Success",
      description: "Class updated successfully!",
    });
    
    // Reset and close dialog
    setFormData({
      departmentId: "",
      courseId: "",
      session: "",
      section: ""
    });
    setIsEditDialogOpen(false);
  };
  
  // Handle deleting a class
  const handleDeleteClass = () => {
    // In a real app, we would call an API here
    toast({
      title: "Success",
      description: "Class deleted successfully!",
    });
    
    // Close dialog
    setIsDeleteDialogOpen(false);
  };
  
  // Open edit dialog and populate form
  const openEditDialog = (cls: any) => {
    setSelectedClass(cls);
    setFormData({
      departmentId: cls.departmentId,
      courseId: cls.courseId,
      session: cls.session,
      section: cls.section
    });
    setIsEditDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (cls: any) => {
    setSelectedClass(cls);
    setIsDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout
      title="Class Management"
      description="Manage class sections and their details"
    >
      {/* Search and filter bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search by course code, name, or section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-white/70" />
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.code}>
                    {dept.code} - {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Class
        </Button>
      </div>

      {/* Classes Table */}
      <div className="reveal rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-white">Department</TableHead>
              <TableHead className="text-white">Course Code</TableHead>
              <TableHead className="text-white">Course Name</TableHead>
              <TableHead className="text-white">Session</TableHead>
              <TableHead className="text-white">Section</TableHead>
              <TableHead className="text-white">Teacher</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClasses.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-white/70"
                >
                  No classes found
                </TableCell>
              </TableRow>
            ) : (
              filteredClasses.map((cls) => (
                <TableRow 
                  key={cls.id} 
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="text-white">
                    {cls.departmentCode}
                  </TableCell>
                  <TableCell className="text-white">
                    {cls.courseCode}
                  </TableCell>
                  <TableCell className="text-white">
                    {cls.courseName}
                  </TableCell>
                  <TableCell className="text-white">
                    {cls.session}
                  </TableCell>
                  <TableCell className="text-white">
                    {cls.section}
                  </TableCell>
                  <TableCell className="text-white">
                    {cls.teacherName || "Not assigned"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(cls)}
                      >
                        <Pencil className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(cls)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Class Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-cuet-navy border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Class</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="department" className="text-white">
                Department
              </Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => handleSelectChange("departmentId", value)}
              >
                <SelectTrigger id="department" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.code} - {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="course" className="text-white">
                Course
              </Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => handleSelectChange("courseId", value)}
                disabled={!formData.departmentId}
              >
                <SelectTrigger id="course" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses
                    .filter(course => course.departmentId === formData.departmentId)
                    .map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="session" className="text-white">
                Session
              </Label>
              <Input
                id="session"
                name="session"
                value={formData.session}
                onChange={handleInputChange}
                placeholder="e.g., 2023-24"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="section" className="text-white">
                Section
              </Label>
              <Input
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                placeholder="e.g., A"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddClass}
              className="bg-gradient-to-r from-blue-600 to-blue-800"
            >
              Add Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-cuet-navy border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Class</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-department" className="text-white">
                Department
              </Label>
              <Select
                value={formData.departmentId}
                onValueChange={(value) => handleSelectChange("departmentId", value)}
              >
                <SelectTrigger id="edit-department" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.code} - {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-course" className="text-white">
                Course
              </Label>
              <Select
                value={formData.courseId}
                onValueChange={(value) => handleSelectChange("courseId", value)}
              >
                <SelectTrigger id="edit-course" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses
                    .filter(course => course.departmentId === formData.departmentId)
                    .map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-session" className="text-white">
                Session
              </Label>
              <Input
                id="edit-session"
                name="session"
                value={formData.session}
                onChange={handleInputChange}
                placeholder="e.g., 2023-24"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-section" className="text-white">
                Section
              </Label>
              <Input
                id="edit-section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                placeholder="e.g., A"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditClass}
              className="bg-gradient-to-r from-blue-600 to-blue-800"
            >
              Update Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-cuet-navy border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the class{" "}
              <span className="font-medium text-white">
                {selectedClass?.courseCode} - {selectedClass?.section}
              </span>{" "}
              and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClass}
              className="bg-red-600 hover:bg-red-700 text-white"
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
