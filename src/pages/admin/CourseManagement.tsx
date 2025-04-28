
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, Pencil, Trash, Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
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
import { mockDepartments } from "@/api/mockData/departments";
import { Course, Department } from "@/types";

const CourseManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for the course form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>({
    code: "",
    name: "",
    credits: 3,
    departmentId: "",
  });
  
  // Mock courses data
  const mockCourses: Course[] = [
    {
      id: "course-1",
      code: "CSE-101",
      name: "Introduction to Computer Science",
      credits: 3,
      departmentId: "dept-1",
    },
    {
      id: "course-2",
      code: "CSE-201",
      name: "Data Structures",
      credits: 3,
      departmentId: "dept-1",
    },
    {
      id: "course-3",
      code: "EEE-101",
      name: "Basic Electrical Engineering",
      credits: 3,
      departmentId: "dept-2",
    },
    {
      id: "course-4",
      code: "MATH-101",
      name: "Calculus and Linear Algebra",
      credits: 3,
      departmentId: "dept-3",
    },
    {
      id: "course-5",
      code: "CSE-202",
      name: "Algorithms",
      credits: 4,
      departmentId: "dept-1",
    },
  ];
  
  // Query to fetch courses
  const {
    data: courses = mockCourses,
    isLoading: isCoursesLoading,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockCourses;
      
      // In a real app, this would be:
      // const response = await axios.get('/api/courses');
      // return response.data;
    },
  });
  
  // Query to fetch departments
  const {
    data: departments = mockDepartments,
    isLoading: isDepartmentsLoading,
  } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockDepartments;
      
      // In a real app, this would be:
      // const response = await axios.get('/api/departments');
      // return response.data;
    },
  });
  
  // Mutation for creating a course
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: Omit<Course, "id">) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate a new course with a random ID
      const newCourse = {
        id: `course-${Date.now()}`,
        ...courseData,
      };
      
      return newCourse;
      
      // In a real app, this would be:
      // const response = await axios.post('/api/courses', courseData);
      // return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: `Course ${isEditing ? "updated" : "created"} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} course. Please try again.`,
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation for updating a course
  const updateCourseMutation = useMutation({
    mutationFn: async (courseData: Course) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return courseData;
      
      // In a real app, this would be:
      // const response = await axios.put(`/api/courses/${courseData.id}`, courseData);
      // return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      resetForm();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Course updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Mutation for deleting a course
  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return { success: true };
      
      // In a real app, this would be:
      // await axios.delete(`/api/courses/${courseId}`);
      // return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast({
        title: "Success",
        description: "Course deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    },
  });
  
  // Function to reset form state
  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      credits: 3,
      departmentId: "",
    });
    setIsEditing(false);
  };
  
  // Function to handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "credits" ? Number(value) : value,
    }));
  };
  
  // Function to handle department selection
  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      departmentId: value,
    }));
  };
  
  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.code || !formData.name || !formData.departmentId || formData.credits === undefined) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for unique code
    if (!isEditing && courses.some(course => course.code === formData.code)) {
      toast({
        title: "Validation Error",
        description: "Course code must be unique.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for valid credits
    if (formData.credits <= 0) {
      toast({
        title: "Validation Error",
        description: "Credits must be a positive number.",
        variant: "destructive",
      });
      return;
    }
    
    // Submit the form based on whether we're editing or creating
    if (isEditing && formData.id) {
      updateCourseMutation.mutate(formData as Course);
    } else {
      createCourseMutation.mutate(formData as Omit<Course, "id">);
    }
  };
  
  // Function to handle edit button click
  const handleEditClick = (course: Course) => {
    setFormData(course);
    setIsEditing(true);
    setIsDialogOpen(true);
  };
  
  // Function to handle delete button click
  const handleDeleteClick = (courseId: string) => {
    deleteCourseMutation.mutate(courseId);
  };
  
  // Function to find department name by ID
  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(dept => dept.id === departmentId);
    return department ? department.name : "Unknown Department";
  };
  
  return (
    <AdminLayout
      title="Course Management"
      description="Add, edit, and manage courses in the system"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Courses</h2>
            <p className="text-white/70">
              {isCoursesLoading
                ? "Loading courses..."
                : `${courses.length} courses in the system`}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-blue-600 to-blue-800"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/10 backdrop-blur-sm border border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {isEditing ? "Edit Course" : "Add New Course"}
                </DialogTitle>
                <DialogDescription className="text-white/70">
                  {isEditing
                    ? "Update the course information below."
                    : "Fill in the details to create a new course."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right text-white/70">
                      Course Code
                    </Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="e.g., CSE-101"
                      className="col-span-3 bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-white/70">
                      Course Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Introduction to Programming"
                      className="col-span-3 bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="credits" className="text-right text-white/70">
                      Credits
                    </Label>
                    <Input
                      id="credits"
                      name="credits"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.credits}
                      onChange={handleInputChange}
                      className="col-span-3 bg-white/5 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="department" className="text-right text-white/70">
                      Department
                    </Label>
                    <div className="col-span-3">
                      <Select
                        value={formData.departmentId}
                        onValueChange={handleDepartmentChange}
                      >
                        <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent className="bg-cuet-navy border border-white/10">
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id} className="text-white hover:bg-white/10">
                              {dept.name} ({dept.code})
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
                    onClick={() => {
                      resetForm();
                      setIsDialogOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-blue-800"
                    disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
                  >
                    {(createCourseMutation.isPending || updateCourseMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {isEditing ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Courses Table */}
        <div className="border border-white/10 rounded-md overflow-hidden">
          <Table>
            <TableCaption>List of all courses in the system</TableCaption>
            <TableHeader className="bg-white/5">
              <TableRow>
                <TableHead className="text-white/80 w-[150px]">Code</TableHead>
                <TableHead className="text-white/80">Name</TableHead>
                <TableHead className="text-white/80">Credits</TableHead>
                <TableHead className="text-white/80">Department</TableHead>
                <TableHead className="text-white/80 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCoursesLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-white/70">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-400 mr-2" />
                      <span>Loading courses...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-white/70">
                    <Book className="mx-auto mb-2 h-8 w-8 text-white/30" />
                    <p>No courses found</p>
                    <Button
                      variant="link"
                      className="text-blue-400"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      Add your first course
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow
                    key={course.id}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="font-medium text-white">{course.code}</TableCell>
                    <TableCell className="text-white">{course.name}</TableCell>
                    <TableCell className="text-white">{course.credits}</TableCell>
                    <TableCell className="text-white">
                      {getDepartmentName(course.departmentId)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/70 hover:text-white hover:bg-white/10"
                          onClick={() => handleEditClick(course)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white/70 hover:text-red-400 hover:bg-red-500/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white/10 backdrop-blur-md border border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Delete Course
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-white/70">
                                Are you sure you want to delete{" "}
                                <span className="text-white font-medium">
                                  {course.name} ({course.code})
                                </span>
                                ? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteClick(course.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseManagement;
