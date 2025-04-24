
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  fetchCourses,
  fetchDepartments,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/api";
import { Course, Department } from "@/types";

const CourseManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Course>>({
    code: "",
    name: "",
    credits: 3,
    departmentId: "",
  });
  
  useEffect(() => {
    document.title = "Course Management - CUET Class Management System";
    
    // Check if user is authenticated and is an admin
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);
  
  // Fetch courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });
  
  // Fetch departments (for the department dropdown)
  const { data: departments = [], isLoading: isLoadingDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });
  
  // Create course mutation
  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Course created",
        description: "The course has been successfully created.",
      });
      handleCloseDialog();
    },
  });
  
  // Update course mutation
  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Course updated",
        description: "The course has been successfully updated.",
      });
      handleCloseDialog();
    },
  });
  
  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Course deleted",
        description: "The course has been successfully deleted.",
      });
      setDeleteId(null);
    },
  });
  
  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "credits" ? Number(value) : value 
    }));
  };
  
  // Handle department selection
  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, departmentId: value }));
  };
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.departmentId || formData.credits === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.credits < 1) {
      toast({
        title: "Validation Error",
        description: "Credits must be at least 1.",
        variant: "destructive",
      });
      return;
    }
    
    if (isEditing && formData.id) {
      updateMutation.mutate(formData as Course);
    } else {
      createMutation.mutate(formData as Omit<Course, "id">);
    }
  };
  
  // Open dialog for creating or editing
  const openDialog = (course?: Course) => {
    if (course) {
      setFormData({ ...course });
      setIsEditing(true);
    } else {
      setFormData({ code: "", name: "", credits: 3, departmentId: "" });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };
  
  // Handle close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData({ code: "", name: "", credits: 3, departmentId: "" });
    setIsEditing(false);
  };
  
  // Handle delete course
  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };
  
  // Get department name by ID
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? `${department.code} - ${department.name}` : "Unknown";
  };
  
  const isLoading = isLoadingCourses || isLoadingDepartments;

  return (
    <DashboardLayout
      title="Course Management"
      description="Manage courses offered by departments"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Book className="mr-2 h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-semibold text-white">Courses</h2>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Button
            onClick={() => openDialog()}
            className="bg-gradient-to-r from-blue-600 to-blue-800"
            disabled={departments.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Edit Course" : "Add New Course"}
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Update the course details below."
                  : "Enter the details for the new course."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="code" className="text-right">
                    Code*
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="CSE-101"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name*
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Introduction to Programming"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="credits" className="text-right">
                    Credits*
                  </Label>
                  <Input
                    id="credits"
                    name="credits"
                    type="number"
                    min={1}
                    value={formData.credits}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right">
                    Department*
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={formData.departmentId}
                      onValueChange={handleDepartmentChange}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.code} - {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Processing..."
                    : isEditing
                    ? "Save Changes"
                    : "Add Course"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p className="text-white/70">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Book className="mb-2 h-12 w-12 text-white/30" />
              <p className="text-white">No courses found</p>
              <p className="text-sm text-white/70">
                Add your first course to get started
              </p>
              {departments.length === 0 && (
                <div className="mt-4 rounded-md bg-yellow-500/10 p-4 text-yellow-400">
                  <p>You need to add departments before you can add courses.</p>
                  <Button
                    className="mt-2"
                    variant="outline"
                    onClick={() => navigate("/admin/departments")}
                  >
                    Go to Department Management
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="w-[120px] text-white/70">Code</TableHead>
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="w-[200px] text-white/70">Department</TableHead>
                  <TableHead className="w-[100px] text-white/70">Credits</TableHead>
                  <TableHead className="w-[120px] text-right text-white/70">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow
                    key={course.id}
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="font-medium text-white">
                      {course.code}
                    </TableCell>
                    <TableCell className="text-white">
                      {course.name}
                    </TableCell>
                    <TableCell className="text-white">
                      {getDepartmentName(course.departmentId)}
                    </TableCell>
                    <TableCell className="text-white">
                      {course.credits}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-400 hover:text-blue-500 hover:bg-blue-700/20"
                          onClick={() => openDialog(course)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-500 hover:bg-red-700/20"
                              onClick={() => setDeleteId(course.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Course
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete{" "}
                                <span className="font-semibold">
                                  {course.name} ({course.code})
                                </span>
                                ? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={handleDelete}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CourseManagement;
