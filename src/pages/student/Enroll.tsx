
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Check, Info, Loader2, Search, X } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockClasses } from "@/api/mockData/classes";
import { mockDepartments } from "@/api/mockData/departments";
import { mockEnrollments } from "@/api/mockData/enrollments";
import { Class } from "@/types";

const Enroll = () => {
  const { toast } = useToast();
  const [availableClasses, setAvailableClasses] = useState<Class[]>(mockClasses);
  const [enrollments, setEnrollments] = useState<any[]>(mockEnrollments);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filter available classes based on search and department filter
  const filteredClasses = availableClasses.filter((classItem) => {
    const matchesSearchTerm =
      classItem.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter 
      ? classItem.department === departmentFilter 
      : true;
    
    return matchesSearchTerm && matchesDepartment;
  });
  
  // Check if a class is already enrolled
  const isEnrolled = (classId: string) => {
    return enrollments.some(
      (enrollment) => enrollment.classId === classId && ["enrolled", "pending"].includes(enrollment.status)
    );
  };
  
  // Get enrollment status for a class
  const getEnrollmentStatus = (classId: string) => {
    const enrollment = enrollments.find(e => e.classId === classId);
    return enrollment ? enrollment.status : null;
  };
  
  // Handle enrollment request
  const handleEnrollRequest = async () => {
    if (!selectedClass) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call to request enrollment
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Create a mock enrollment
      const newEnrollment = {
        id: `enr-${Date.now()}`,
        studentId: "student-1", // In a real app, this would be the current user's ID
        classId: selectedClass.id,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      
      // Update enrollments state
      setEnrollments([...enrollments, newEnrollment]);
      
      // Close dialog and show success message
      setIsDialogOpen(false);
      setSelectedClass(null);
      
      toast({
        title: "Enrollment Requested",
        description: `Your enrollment request for ${selectedClass.courseName} has been submitted and is pending approval.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit enrollment request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout
      title="Enroll in Classes"
      description="Browse available classes and request enrollment"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Available Classes</CardTitle>
              <div className="flex space-x-2">
                <div className="relative w-[200px]">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 border-white/10"
                  />
                </div>
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
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((classItem) => {
                      const enrolled = isEnrolled(classItem.id);
                      const status = getEnrollmentStatus(classItem.id);
                      
                      return (
                        <TableRow key={classItem.id}>
                          <TableCell className="font-mono">
                            {classItem.courseCode}
                          </TableCell>
                          <TableCell className="font-medium text-white">
                            {classItem.courseName}
                          </TableCell>
                          <TableCell>{classItem.department}</TableCell>
                          <TableCell>
                            {classItem.session} - {classItem.section}
                          </TableCell>
                          <TableCell className="text-right">
                            {enrolled ? (
                              status === "enrolled" ? (
                                <span className="inline-flex items-center rounded-md bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                                  <Check className="mr-1 h-3 w-3" />
                                  Enrolled
                                </span>
                              ) : (
                                <span className="inline-flex items-center rounded-md bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                                  <Info className="mr-1 h-3 w-3" />
                                  Pending
                                </span>
                              )
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedClass(classItem);
                                  setIsDialogOpen(true);
                                }}
                              >
                                Request Enrollment
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <p className="text-white/70">No classes found.</p>
                        <p className="text-sm text-white/50">
                          Try adjusting your search or filter.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Your Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments.length > 0 ? (
                  enrollments.map((enrollment) => {
                    const classInfo = mockClasses.find(c => c.id === enrollment.classId);
                    if (!classInfo) return null;
                    
                    return (
                      <div 
                        key={enrollment.id} 
                        className="rounded-lg border border-white/10 p-3"
                      >
                        <div className="flex justify-between">
                          <h4 className="font-medium text-white">
                            {classInfo.courseName}
                          </h4>
                          {enrollment.status === "enrolled" ? (
                            <span className="inline-flex items-center rounded-md bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                              <Check className="mr-1 h-3 w-3" />
                              Enrolled
                            </span>
                          ) : enrollment.status === "pending" ? (
                            <span className="inline-flex items-center rounded-md bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                              <Info className="mr-1 h-3 w-3" />
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-md bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">
                              <X className="mr-1 h-3 w-3" />
                              Rejected
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-white/70">
                          {classInfo.courseCode} - {classInfo.department}
                        </p>
                        <p className="text-xs text-white/50">
                          {classInfo.session} - Section {classInfo.section}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Info className="mb-2 h-10 w-10 text-blue-400 opacity-70" />
                    <p className="text-white/70">
                      You haven't enrolled in any classes yet.
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      Browse available classes and request enrollment.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Enrollment Help</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="space-y-4 text-white/70">
                <p>
                  <strong className="text-white">How enrollment works:</strong>
                  <br />
                  Request enrollment in your desired classes. Class Representatives (CRs) review and approve requests.
                </p>
                <p>
                  <strong className="text-white">Need help?</strong>
                  <br />
                  Contact your department office or reach out to the class CR directly if you have questions about enrollment.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Enrollment Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Enrollment Request</DialogTitle>
            <DialogDescription>
              You are about to request enrollment in the following class:
            </DialogDescription>
          </DialogHeader>
          
          {selectedClass && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h3 className="mb-2 text-lg font-medium text-white">
                  {selectedClass.courseName}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Course Code:</span>
                    <span className="font-mono text-white">{selectedClass.courseCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Department:</span>
                    <span className="text-white">{selectedClass.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Session:</span>
                    <span className="text-white">{selectedClass.session}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Section:</span>
                    <span className="text-white">{selectedClass.section}</span>
                  </div>
                </div>
              </div>
              
              <DialogDescription>
                Your enrollment request will be sent to the Class Representative (CR) for approval.
                You'll be notified once it's approved or rejected.
              </DialogDescription>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnrollRequest}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Enroll;
