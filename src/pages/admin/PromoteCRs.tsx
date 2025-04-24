
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserCheck, Search, Filter, Check, X } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { mockDepartments } from "@/api/mockData/departments";

const PromoteCRs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [isPromoteDialogOpen, setIsPromoteDialogOpen] = useState(false);
  const [isDemoteDialogOpen, setIsDemoteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [crStudents, setCrStudents] = useState<{[key: string]: string}>({});
  
  // In a real app, this would come from an API
  // This is just for mock data - students who are CRs for specific classes
  const [studentCRMap, setStudentCRMap] = useState<{[key: string]: string}>({});
  
  useEffect(() => {
    document.title = "Promote CRs - CUET Class Management System";
    
    // Check if user is authenticated as admin
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/login");
    }
    
    // Initialize some students as CRs for demo purposes
    const initialCRMap: {[key: string]: string} = {};
    mockClasses.slice(0, 3).forEach((cls, index) => {
      const students = mockUsers.filter(u => u.role === "student");
      if (students[index]) {
        initialCRMap[cls.id] = students[index].id;
      }
    });
    
    setStudentCRMap(initialCRMap);
  }, [navigate]);
  
  // Load students
  const { data: students = [] } = useQuery({
    queryKey: ["students"],
    queryFn: () => mockUsers.filter(user => user.role === "student"),
  });
  
  // Load departments
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => mockDepartments,
  });
  
  // Load classes
  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: () => mockClasses,
  });
  
  // Filter students based on search, department, and class
  useEffect(() => {
    let filtered = [...students];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        student => 
          student.name.toLowerCase().includes(term) ||
          student.email.toLowerCase().includes(term)
      );
    }
    
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        student => student.departmentCode === departmentFilter
      );
    }
    
    if (classFilter !== "all") {
      // In a real app, we would filter students by class enrollment
      // For this mock, we'll just simulate it
      const selectedClass = classes.find(c => c.id === classFilter);
      if (selectedClass) {
        filtered = filtered.filter(
          student => student.departmentCode === selectedClass.departmentCode
        );
      }
    }
    
    setFilteredStudents(filtered);
  }, [searchTerm, departmentFilter, classFilter, students, classes]);
  
  // Check if a student is a CR for a specific class
  const isStudentCR = (studentId: string, classId: string) => {
    return studentCRMap[classId] === studentId;
  };
  
  // Get the class for which a student is a CR
  const getStudentCRClass = (studentId: string) => {
    const classId = Object.keys(studentCRMap).find(
      classId => studentCRMap[classId] === studentId
    );
    
    if (!classId) return null;
    
    return classes.find(c => c.id === classId);
  };
  
  // Handle promoting a student to CR
  const handlePromoteStudent = () => {
    if (!selectedStudent || !classFilter || classFilter === "all") return;
    
    // Check if there's already a CR for this class
    const currentCR = studentCRMap[classFilter];
    if (currentCR) {
      // In a real app, we would handle this better
      // For now, we'll just update the CR
      toast({
        title: "Note",
        description: "Another student was already CR for this class. They have been replaced.",
      });
    }
    
    // Update student CR mapping
    const updatedMap = { ...studentCRMap, [classFilter]: selectedStudent.id };
    setStudentCRMap(updatedMap);
    
    // In a real app, we would call an API here
    toast({
      title: "Success",
      description: `${selectedStudent.name} has been promoted to Class Representative`,
    });
    
    setIsPromoteDialogOpen(false);
  };
  
  // Handle demoting a student from CR
  const handleDemoteStudent = () => {
    if (!selectedStudent) return;
    
    // Find the class for which the student is a CR
    const classId = Object.keys(studentCRMap).find(
      classId => studentCRMap[classId] === selectedStudent.id
    );
    
    if (!classId) return;
    
    // Remove student from CR mapping
    const updatedMap = { ...studentCRMap };
    delete updatedMap[classId];
    setStudentCRMap(updatedMap);
    
    // In a real app, we would call an API here
    toast({
      title: "Success",
      description: `${selectedStudent.name} is no longer a Class Representative`,
    });
    
    setIsDemoteDialogOpen(false);
  };
  
  // Open promote dialog
  const openPromoteDialog = (student: any) => {
    setSelectedStudent(student);
    setIsPromoteDialogOpen(true);
  };
  
  // Open demote dialog
  const openDemoteDialog = (student: any) => {
    setSelectedStudent(student);
    setIsDemoteDialogOpen(true);
  };
  
  // Toggle CR status directly
  const toggleCRStatus = (student: any) => {
    // Check if student is already a CR
    const classId = Object.keys(studentCRMap).find(
      classId => studentCRMap[classId] === student.id
    );
    
    if (classId) {
      // Student is already a CR, demote them
      openDemoteDialog(student);
    } else {
      // Student is not a CR, promote them
      if (classFilter === "all") {
        toast({
          title: "Error",
          description: "Please select a class before promoting a student to CR",
          variant: "destructive",
        });
        return;
      }
      openPromoteDialog(student);
    }
  };

  return (
    <DashboardLayout
      title="Promote Class Representatives"
      description="Designate students as Class Representatives (CRs)"
    >
      {/* Search and filter bar */}
      <div className="mb-6 flex flex-col gap-4 sm:items-center lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-white/70" />
            <Select
              value={departmentFilter}
              onValueChange={setDepartmentFilter}
            >
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
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
          
          <div className="flex items-center space-x-2">
            <UserCheck className="h-5 w-5 text-white/70" />
            <Select
              value={classFilter}
              onValueChange={setClassFilter}
            >
              <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.courseCode} (Section {cls.section})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="reveal rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Department</TableHead>
              <TableHead className="text-white">Session</TableHead>
              <TableHead className="text-white">CR Status</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-white/70"
                >
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => {
                const crClass = getStudentCRClass(student.id);
                return (
                  <TableRow 
                    key={student.id} 
                    className="border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="font-medium text-white">
                      {student.name}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {student.email}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {student.departmentCode}
                    </TableCell>
                    <TableCell className="text-white/80">
                      {student.session}
                    </TableCell>
                    <TableCell>
                      {crClass ? (
                        <Badge className="bg-green-700/30 text-green-400 hover:bg-green-700/50">
                          CR for {crClass.courseCode} (Section {crClass.section})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-white/10 text-white/50">
                          Not a CR
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <Switch
                          checked={!!crClass}
                          onCheckedChange={() => toggleCRStatus(student)}
                          className="data-[state=checked]:bg-green-600"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Promote Student Dialog */}
      <AlertDialog open={isPromoteDialogOpen} onOpenChange={setIsPromoteDialogOpen}>
        <AlertDialogContent className="bg-cuet-navy border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Promote to Class Representative
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to promote{" "}
              <span className="font-medium text-white">
                {selectedStudent?.name}
              </span>{" "}
              as Class Representative for{" "}
              <span className="font-medium text-white">
                {classes.find(c => c.id === classFilter)?.courseCode} (Section {classes.find(c => c.id === classFilter)?.section})?
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePromoteStudent}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="mr-2 h-4 w-4" />
              Promote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Demote Student Dialog */}
      <AlertDialog open={isDemoteDialogOpen} onOpenChange={setIsDemoteDialogOpen}>
        <AlertDialogContent className="bg-cuet-navy border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Remove Class Representative Status
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium text-white">
                {selectedStudent?.name}
              </span>{" "}
              as Class Representative?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDemoteStudent}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <X className="mr-2 h-4 w-4" />
              Remove CR Status
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default PromoteCRs;
