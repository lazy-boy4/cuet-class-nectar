
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, Plus, Search, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { mockClasses } from "@/api/mockData/classes";
import { mockDepartments } from "@/api/mockData/departments";
import { Class } from "@/types";

const Enroll = () => {
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [enrollmentRequests, setEnrollmentRequests] = useState<{
    classId: string;
    status: "pending" | "approved" | "rejected";
    requestedAt: Date;
  }[]>([
    {
      classId: "class-101",
      status: "approved",
      requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      classId: "class-102",
      status: "pending",
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      classId: "class-103",
      status: "rejected",
      requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    },
  ]);
  
  // Get all departments from the mock data
  const departments = mockDepartments;
  
  // Get unique session values from classes
  const sessions = Array.from(
    new Set(mockClasses.map((classItem) => classItem.session))
  );
  
  // Filter classes based on search term and filters
  const filteredClasses = mockClasses.filter((classItem) => {
    // Check if class is already in enrollment requests
    const isAlreadyRequested = enrollmentRequests.some(
      (req) => req.classId === classItem.id
    );
    
    // Skip if already requested
    if (isAlreadyRequested) return false;
    
    // Apply search filter
    const matchesSearch =
      classItem.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply department filter
    const matchesDepartment = departmentFilter
      ? classItem.departmentId === departmentFilter // Fixed: Changed from department to departmentId
      : true;
    
    // Apply session filter
    const matchesSession = sessionFilter
      ? classItem.session === sessionFilter
      : true;
    
    return matchesSearch && matchesDepartment && matchesSession;
  });
  
  // Handle enrollment request
  const handleEnrollmentRequest = (classId: string) => {
    // In a real app, this would make an API call
    
    // Add to enrollment requests
    setEnrollmentRequests([
      ...enrollmentRequests,
      {
        classId,
        status: "pending",
        requestedAt: new Date(),
      },
    ]);
    
    // Show success toast
    toast({
      title: "Enrollment Requested",
      description: "Your enrollment request has been submitted successfully.",
    });
  };
  
  // Function to get class details by ID
  const getClassById = (id: string): Class | undefined => {
    return mockClasses.find((c) => c.id === id);
  };
  
  // Function to get department name from ID
  const getDepartmentName = (departmentId: string): string => {
    const department = departments.find((d) => d.id === departmentId);
    return department ? department.name : departmentId;
  };
  
  // Calculate time difference for showing "requested X days ago"
  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (diffInDays === 0) return "today";
    if (diffInDays === 1) return "yesterday";
    return `${diffInDays} days ago`;
  };
  
  return (
    <DashboardLayout
      title="Enroll in Classes"
      description="Browse available classes and submit enrollment requests"
    >
      <div className="space-y-8">
        {/* Available Classes */}
        <Card>
          <CardHeader>
            <CardTitle>Available Classes</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search classes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-xs border-white/10"
                />
              </div>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px] border-white/10">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  {departments.map((dept) => (
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
            </div>
            
            {/* Classes Table */}
            <div className="overflow-hidden rounded-md border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((classItem) => (
                      <TableRow key={classItem.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-white">
                              {classItem.courseName}
                            </div>
                            <div className="text-sm text-white/60">
                              {classItem.courseCode}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getDepartmentName(classItem.departmentId)}</TableCell> {/* Fixed: Changed from department to departmentId */}
                        <TableCell>{classItem.session}</TableCell>
                        <TableCell>{classItem.section}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleEnrollmentRequest(classItem.id)}
                          >
                            <Plus className="mr-1 h-4 w-4" /> Request Enrollment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <div className="text-white/60">
                          No matching classes found. Try adjusting your filters.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        {/* Enrollment Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Your Enrollment Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollmentRequests.length > 0 ? (
              <div className="overflow-hidden rounded-md border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollmentRequests.map((request) => {
                      const classItem = getClassById(request.classId);
                      if (!classItem) return null;
                      
                      return (
                        <TableRow key={request.classId}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-white">
                                {classItem.courseName}
                              </div>
                              <div className="text-sm text-white/60">
                                {classItem.courseCode}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getDepartmentName(classItem.departmentId)}</TableCell> {/* Fixed: Changed from department to departmentId */}
                          <TableCell>
                            <span className="text-sm text-white/60">
                              {getTimeAgo(request.requestedAt)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {request.status === "approved" ? (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                                <Check className="mr-1 h-3 w-3" />
                                Approved
                              </span>
                            ) : request.status === "rejected" ? (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-800">
                                <X className="mr-1 h-3 w-3" />
                                Rejected
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800">
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Pending
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {request.status === "approved" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                asChild
                              >
                                <Link to={`/student/classes/${request.classId}`}>
                                  View Class
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newRequests = enrollmentRequests.filter(
                                    (req) => req.classId !== request.classId
                                  );
                                  setEnrollmentRequests(newRequests);
                                  
                                  toast({
                                    title: "Request Cancelled",
                                    description: "Your enrollment request has been cancelled.",
                                  });
                                }}
                              >
                                Cancel Request
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex h-24 flex-col items-center justify-center rounded-md border border-dashed border-white/10 p-8 text-center">
                <p className="text-white/60">
                  You haven't requested enrollment in any classes yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Enroll;
