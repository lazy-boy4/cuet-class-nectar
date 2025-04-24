
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Plus, Check, X, Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockClasses } from "@/api/mockData/classes";
import { mockDepartments } from "@/api/mockData/departments";
import { mockUsers } from "@/api/mockData/users";
import { mockEnrollments } from "@/api/mockData/enrollments";

const Enroll = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
  const [isDropDialogOpen, setIsDropDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  
  useEffect(() => {
    document.title = "Enroll in Classes - CUET Class Management System";
    
    // Check if user is authenticated as student
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "student") {
      navigate("/login");
      return;
    }
    
    // Get current user from mock data
    const student = mockUsers.find(u => u.role === "student");
    if (student) {
      setCurrentUser(student);
    }
  }, [navigate]);
  
  // Load departments
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => mockDepartments,
  });
  
  // Load classes and enrollments
  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: () => mockClasses,
  });
  
  // Load user enrollments
  const { data: userEnrollments = [] } = useQuery({
    queryKey: ["userEnrollments", currentUser?.id],
    queryFn: () => mockEnrollments.filter(e => e.studentId === currentUser?.id),
    enabled: !!currentUser,
  });
  
  // Set enrollments when data is loaded
  useEffect(() => {
    if (userEnrollments.length > 0) {
      setEnrollments(userEnrollments);
    }
  }, [userEnrollments]);
  
  // Filter available classes (not already enrolled or pending)
  useEffect(() => {
    if (classes.length > 0 && enrollments.length >= 0) {
      const enrolledClassIds = enrollments.map(e => e.classId);
      
      const available = classes.filter(cls => !enrolledClassIds.includes(cls.id));
      setAvailableClasses(available);
      
      // Apply initial filters
      filterClasses(available, searchTerm, departmentFilter);
    }
  }, [classes, enrollments]);
  
  // Filter classes when search term or department filter changes
  const filterClasses = (classesToFilter: any[], search: string, department: string) => {
    let filtered = [...classesToFilter];
    
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        cls => 
          cls.courseCode.toLowerCase().includes(term) ||
          cls.courseName.toLowerCase().includes(term) ||
          (cls.teacherName && cls.teacherName.toLowerCase().includes(term))
      );
    }
    
    if (department !== "all") {
      filtered = filtered.filter(cls => cls.departmentCode === department);
    }
    
    setFilteredClasses(filtered);
  };
  
  useEffect(() => {
    filterClasses(availableClasses, searchTerm, departmentFilter);
  }, [searchTerm, departmentFilter, availableClasses]);
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-700/30 text-green-400">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-700/30 text-yellow-400">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-700/30 text-red-400">Rejected</Badge>;
      default:
        return <Badge className="bg-white/20 text-white/70">{status}</Badge>;
    }
  };
  
  // Open enroll dialog
  const openEnrollDialog = (cls: any) => {
    setSelectedClass(cls);
    setIsEnrollDialogOpen(true);
  };
  
  // Open drop dialog
  const openDropDialog = (enrollment: any) => {
    const cls = classes.find(c => c.id === enrollment.classId);
    setSelectedClass({
      ...cls,
      enrollmentId: enrollment.id,
      status: enrollment.status
    });
    setIsDropDialogOpen(true);
  };
  
  // Handle enrolling in a class
  const handleEnroll = () => {
    if (!selectedClass || !currentUser) return;
    
    // Create new enrollment
    const newEnrollment = {
      id: `enr-${Date.now()}`,
      studentId: currentUser.id,
      classId: selectedClass.id,
      status: "pending",
      enrolledAt: new Date().toISOString(),
    };
    
    // Add to enrollments
    setEnrollments(prev => [...prev, newEnrollment]);
    
    // In a real app, we would call an API here
    toast({
      title: "Enrollment Request Submitted",
      description: `Your enrollment request for ${selectedClass.courseCode} (Section ${selectedClass.section}) is pending approval.`,
    });
    
    setIsEnrollDialogOpen(false);
  };
  
  // Handle dropping a class
  const handleDrop = () => {
    if (!selectedClass || !currentUser) return;
    
    // Remove from enrollments
    setEnrollments(prev => 
      prev.filter(e => e.id !== selectedClass.enrollmentId)
    );
    
    // In a real app, we would call an API here
    toast({
      title: "Class Dropped",
      description: `You have successfully dropped ${selectedClass.courseCode} (Section ${selectedClass.section}).`,
    });
    
    setIsDropDialogOpen(false);
  };

  return (
    <DashboardLayout
      title="Course Enrollment"
      description="Enroll in classes for the current semester"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Available Classes */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-white">Available Classes</h2>
          
          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/50"
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
                      {dept.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Classes List */}
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
            <div className="max-h-[500px] overflow-y-auto">
              {filteredClasses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Clock className="mb-2 h-12 w-12 text-white/30" />
                  <p className="text-lg text-white">No available classes</p>
                  <p className="text-sm text-white/70">
                    Check back later or adjust your search filters
                  </p>
                </div>
              ) : (
                filteredClasses.map((cls) => (
                  <Card 
                    key={cls.id} 
                    className="border-white/10 bg-transparent hover:bg-white/[0.03] transition-all rounded-none border-x-0 border-t-0 last:border-b-0"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-white flex justify-between items-start">
                        <span>{cls.courseCode}: {cls.courseName}</span>
                        <Badge variant="outline" className="ml-2 border-white/10">
                          {cls.departmentCode}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Section {cls.section} • {cls.session}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-white/70">
                        Instructor: {cls.teacherName || "Not assigned"}
                      </p>
                      <p className="text-sm text-white/70">
                        Credits: {cls.credits || 3}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => openEnrollDialog(cls)}
                        className="bg-gradient-to-r from-blue-600 to-blue-800"
                        size="sm"
                      >
                        <Plus className="mr-1 h-4 w-4" /> Request Enrollment
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* My Enrollments */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xl font-semibold text-white">My Enrollments</h2>
          
          <div className="rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-white/5">
                  <TableHead className="text-white">Course</TableHead>
                  <TableHead className="text-white">Section</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.length === 0 ? (
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-white/70"
                    >
                      You haven't enrolled in any classes yet
                    </TableCell>
                  </TableRow>
                ) : (
                  enrollments.map((enrollment) => {
                    const cls = classes.find(c => c.id === enrollment.classId);
                    if (!cls) return null;
                    
                    return (
                      <TableRow 
                        key={enrollment.id} 
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell className="font-medium text-white">
                          {cls.courseCode}: {cls.courseName}
                        </TableCell>
                        <TableCell className="text-white">
                          {cls.section}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(enrollment.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDropDialog(enrollment)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            disabled={enrollment.status === "rejected"}
                          >
                            <X className="mr-1 h-4 w-4" /> Drop
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Enroll Dialog */}
      <AlertDialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
        <AlertDialogContent className="bg-cuet-navy border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Enroll in Class
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to request enrollment in{" "}
              <span className="font-medium text-white">
                {selectedClass?.courseCode}: {selectedClass?.courseName}
              </span>{" "}
              (Section {selectedClass?.section})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEnroll}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Request Enrollment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Drop Class Dialog */}
      <AlertDialog open={isDropDialogOpen} onOpenChange={setIsDropDialogOpen}>
        <AlertDialogContent className="bg-cuet-navy border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Drop Class
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to drop{" "}
              <span className="font-medium text-white">
                {selectedClass?.courseCode}: {selectedClass?.courseName}
              </span>{" "}
              (Section {selectedClass?.section})?
              {selectedClass?.status === "approved" && (
                <p className="mt-2 text-red-400">
                  Warning: Dropping an approved class may affect your academic record.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDrop}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Drop Class
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Enroll;
