
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Bell, 
  Users, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  MessageCircle,
  File,
  Upload
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockClasses } from "@/api/mockData/classes";
import { mockUsers } from "@/api/mockData/users";
import { mockAttendance } from "@/api/mockData/attendance";
import { mockEnrollments } from "@/api/mockData/enrollments";
import { mockNotices } from "@/api/mockData/notices";
import { format } from "date-fns";

const ClassDetails = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isUserCR, setIsUserCR] = useState(false);
  const [isPostNoticeDialogOpen, setIsPostNoticeDialogOpen] = useState(false);
  const [isUploadFileDialogOpen, setIsUploadFileDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEnrollmentsOpen, setIsEnrollmentsOpen] = useState(false);
  
  // Notice form
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: ""
  });
  
  useEffect(() => {
    document.title = "Class Details - CUET Class Management System";
    
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
      
      // Check if user is CR for this class
      // In a real app, this would be determined from the backend
      const isCR = Math.random() > 0.5; // Randomly assign CR status for demo
      setIsUserCR(isCR);
    }
    
    // Check if class exists
    if (!classId) {
      navigate("/student/dashboard");
      return;
    }
  }, [navigate, classId]);
  
  // Get class details
  const { data: classDetails } = useQuery({
    queryKey: ["classDetails", classId],
    queryFn: () => {
      const cls = mockClasses.find(c => c.id === classId);
      if (!cls) throw new Error("Class not found");
      return cls;
    },
    enabled: !!classId,
  });
  
  // Get attendance for current student
  const { data: attendanceRecords = [] } = useQuery({
    queryKey: ["studentAttendance", classId, currentUser?.id],
    queryFn: async () => {
      // In a real app, we would fetch attendance records for this student and class
      return mockAttendance.filter(
        record => record.classId === classId && record.studentId === currentUser?.id
      );
    },
    enabled: !!classId && !!currentUser,
  });
  
  // Get notices for this class
  const { data: classNotices = [] } = useQuery({
    queryKey: ["classNotices", classId],
    queryFn: async () => {
      // In a real app, we would fetch notices for this class
      return mockNotices.filter(
        notice => notice.classId === classId || notice.isGlobal
      );
    },
    enabled: !!classId,
  });
  
  // Get enrollment requests (for CR only)
  const { data: enrollmentRequests = [] } = useQuery({
    queryKey: ["enrollmentRequests", classId],
    queryFn: async () => {
      // In a real app, we would fetch pending enrollment requests
      return mockEnrollments.filter(
        e => e.classId === classId && e.status === "pending"
      );
    },
    enabled: !!classId && isUserCR,
  });
  
  // Calculate attendance stats
  const calculateAttendanceStats = () => {
    const present = attendanceRecords.filter(a => a.status === "present").length;
    const absent = attendanceRecords.filter(a => a.status === "absent").length;
    const late = attendanceRecords.filter(a => a.status === "late").length;
    const total = present + absent + late;
    
    return {
      present,
      absent,
      late,
      total,
      percentage: total > 0 ? Math.round((present + late * 0.5) / total * 100) : 0
    };
  };
  
  const attendanceStats = calculateAttendanceStats();
  
  // Handle notice form input changes
  const handleNoticeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNoticeForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  // Handle posting a notice
  const handlePostNotice = () => {
    if (!noticeForm.title || !noticeForm.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would send this to an API
    toast({
      title: "Success",
      description: "Notice has been posted",
    });
    
    setNoticeForm({
      title: "",
      content: ""
    });
    setIsPostNoticeDialogOpen(false);
  };
  
  // Handle uploading a file
  const handleUploadFile = () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would send this file to an API
    toast({
      title: "Success",
      description: `File "${selectedFile.name}" has been uploaded`,
    });
    
    setSelectedFile(null);
    setIsUploadFileDialogOpen(false);
  };
  
  // Handle approve/reject enrollment
  const handleEnrollmentAction = (enrollmentId: string, action: "approve" | "reject") => {
    // In a real app, we would send this to an API
    toast({
      title: "Success",
      description: `Enrollment request ${action === "approve" ? "approved" : "rejected"}`,
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMMM d, yyyy");
  };

  if (!classDetails) {
    return (
      <DashboardLayout
        title="Class Details"
        description="View information about your class"
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-white/70">Loading class details...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`${classDetails.courseCode}: ${classDetails.courseName}`}
      description={`Section ${classDetails.section} • ${classDetails.session} • ${classDetails.departmentCode}`}
    >
      <div className="mb-4">
        {isUserCR && (
          <Badge className="bg-green-700/30 text-green-400">
            You are the Class Representative
          </Badge>
        )}
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="overview">
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="attendance">
            <Users className="mr-2 h-4 w-4" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="notices">
            <Bell className="mr-2 h-4 w-4" /> Notices
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileText className="mr-2 h-4 w-4" /> Resources
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Class Information */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Class Information</CardTitle>
                <CardDescription>Details about this course section</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-white/10 py-2">
                    <span className="font-medium text-white/70">Course Code</span>
                    <span className="text-white">{classDetails.courseCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 py-2">
                    <span className="font-medium text-white/70">Course Name</span>
                    <span className="text-white">{classDetails.courseName}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 py-2">
                    <span className="font-medium text-white/70">Section</span>
                    <span className="text-white">{classDetails.section}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 py-2">
                    <span className="font-medium text-white/70">Department</span>
                    <span className="text-white">{classDetails.departmentCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 py-2">
                    <span className="font-medium text-white/70">Session</span>
                    <span className="text-white">{classDetails.session}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 py-2">
                    <span className="font-medium text-white/70">Instructor</span>
                    <span className="text-white">{classDetails.teacherName || "Not assigned"}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="font-medium text-white/70">Credits</span>
                    <span className="text-white">{classDetails.credits || 3}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Attendance Summary</CardTitle>
                <CardDescription>Your attendance in this class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative flex h-40 w-40 items-center justify-center">
                    {/* Progress Circle */}
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      {/* Background Circle */}
                      <circle
                        className="text-white/10"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                      {/* Progress Circle */}
                      <circle
                        className="text-blue-500"
                        strokeWidth="10"
                        strokeDasharray={`${attendanceStats.percentage * 2.51} 251.2`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {attendanceStats.percentage}%
                      </span>
                      <span className="text-sm text-white/70">Attendance</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-green-500/10 p-2 text-center">
                    <p className="text-lg font-bold text-green-400">
                      {attendanceStats.present}
                    </p>
                    <p className="text-xs text-green-400/80">Present</p>
                  </div>
                  <div className="rounded-lg bg-yellow-500/10 p-2 text-center">
                    <p className="text-lg font-bold text-yellow-400">
                      {attendanceStats.late}
                    </p>
                    <p className="text-xs text-yellow-400/80">Late</p>
                  </div>
                  <div className="rounded-lg bg-red-500/10 p-2 text-center">
                    <p className="text-lg font-bold text-red-400">
                      {attendanceStats.absent}
                    </p>
                    <p className="text-xs text-red-400/80">Absent</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  {attendanceStats.percentage < 75 ? (
                    <div className="rounded-md bg-red-500/10 p-2 text-sm text-center text-red-400">
                      <XCircle className="inline-block mr-1 h-4 w-4" />
                      Your attendance is below the required 75%.
                    </div>
                  ) : (
                    <div className="rounded-md bg-green-500/10 p-2 text-sm text-center text-green-400">
                      <CheckCircle className="inline-block mr-1 h-4 w-4" />
                      Your attendance meets the required minimum.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* CR Features */}
          {isUserCR && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">CR Tools</CardTitle>
                <CardDescription>Special tools for Class Representatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Button 
                    onClick={() => setIsPostNoticeDialogOpen(true)}
                    className="flex flex-col h-auto py-4 space-y-2 bg-gradient-to-r from-blue-600 to-blue-800"
                  >
                    <Bell className="h-6 w-6" />
                    <span>Post Notice</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setIsUploadFileDialogOpen(true)}
                    className="flex flex-col h-auto py-4 space-y-2 bg-gradient-to-r from-purple-600 to-purple-800"
                  >
                    <Upload className="h-6 w-6" />
                    <span>Upload Schedule</span>
                  </Button>
                  
                  <Button 
                    onClick={() => setIsEnrollmentsOpen(prev => !prev)}
                    className="flex flex-col h-auto py-4 space-y-2 bg-gradient-to-r from-green-600 to-green-800"
                  >
                    <Users className="h-6 w-6" />
                    <span>Manage Enrollments</span>
                  </Button>
                </div>
                
                {/* Enrollment Requests Panel */}
                <Collapsible
                  open={isEnrollmentsOpen}
                  onOpenChange={setIsEnrollmentsOpen}
                  className="mt-4"
                >
                  <CollapsibleContent className="pt-2">
                    <Card className="border-white/10 bg-white/10">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white text-lg">Enrollment Requests</CardTitle>
                        <CardDescription>
                          {enrollmentRequests.length === 0 
                            ? "No pending enrollment requests" 
                            : `${enrollmentRequests.length} pending request(s)`}
                        </CardDescription>
                      </CardHeader>
                      {enrollmentRequests.length > 0 && (
                        <CardContent>
                          <div className="rounded-lg border border-white/10">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-white/10 hover:bg-white/5">
                                  <TableHead className="text-white">Student</TableHead>
                                  <TableHead className="text-white">Date</TableHead>
                                  <TableHead className="text-white text-right">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {enrollmentRequests.map((request) => {
                                  const student = mockUsers.find(u => u.id === request.studentId);
                                  return (
                                    <TableRow 
                                      key={request.id} 
                                      className="border-white/10 hover:bg-white/5"
                                    >
                                      <TableCell className="font-medium text-white">
                                        {student ? student.name : "Unknown Student"}
                                      </TableCell>
                                      <TableCell className="text-white/80">
                                        {formatDate(request.enrolledAt)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <div className="flex justify-end space-x-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-green-400 hover:bg-green-900/20 hover:text-green-300"
                                            onClick={() => handleEnrollmentAction(request.id, "approve")}
                                          >
                                            <CheckCircle className="mr-1 h-4 w-4" /> Approve
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-400 hover:bg-red-900/20 hover:text-red-300"
                                            onClick={() => handleEnrollmentAction(request.id, "reject")}
                                          >
                                            <XCircle className="mr-1 h-4 w-4" /> Reject
                                          </Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Attendance Tab */}
        <TabsContent value="attendance" className="mt-6 space-y-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Attendance History</CardTitle>
              <CardDescription>Your attendance records for this class</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white">Date</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendanceRecords.length === 0 ? (
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell
                          colSpan={2}
                          className="h-24 text-center text-white/70"
                        >
                          No attendance records found
                        </TableCell>
                      </TableRow>
                    ) : (
                      attendanceRecords.map((record) => (
                        <TableRow 
                          key={record.id} 
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell className="font-medium text-white">
                            {formatDate(record.date)}
                          </TableCell>
                          <TableCell>
                            {record.status === "present" ? (
                              <Badge className="bg-green-700/30 text-green-400">
                                <CheckCircle className="mr-1 h-4 w-4" /> Present
                              </Badge>
                            ) : record.status === "late" ? (
                              <Badge className="bg-yellow-700/30 text-yellow-400">
                                <Clock className="mr-1 h-4 w-4" /> Late
                              </Badge>
                            ) : (
                              <Badge className="bg-red-700/30 text-red-400">
                                <XCircle className="mr-1 h-4 w-4" /> Absent
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notices Tab */}
        <TabsContent value="notices" className="mt-6 space-y-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Class Notices</CardTitle>
                  <CardDescription>
                    Announcements and updates for this class
                  </CardDescription>
                </div>
                {isUserCR && (
                  <Button 
                    onClick={() => setIsPostNoticeDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-800"
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Post Notice
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {classNotices.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 rounded-lg border border-white/10 bg-white/5">
                  <Bell className="mb-2 h-12 w-12 text-white/30" />
                  <h3 className="mb-1 text-xl font-medium text-white">No notices yet</h3>
                  <p className="text-white/70">
                    There are no announcements for this class
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {classNotices.map((notice) => (
                    <Card 
                      key={notice.id} 
                      className={`border-white/10 ${
                        notice.isGlobal 
                          ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20" 
                          : "bg-white/5"
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white">{notice.title}</CardTitle>
                            <CardDescription className="flex items-center space-x-2">
                              {notice.isGlobal ? (
                                <Badge className="bg-blue-700/30 text-blue-400">Global</Badge>
                              ) : (
                                <Badge className="bg-purple-700/30 text-purple-400">{classDetails.courseCode}</Badge>
                              )}
                              <span className="text-white/50">
                                Posted by {notice.creatorName} • {formatDate(notice.createdAt)}
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80 whitespace-pre-line">{notice.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Resources Tab */}
        <TabsContent value="resources" className="mt-6 space-y-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Class Resources</CardTitle>
                  <CardDescription>
                    Materials, schedules, and documents for this class
                  </CardDescription>
                </div>
                {isUserCR && (
                  <Button 
                    onClick={() => setIsUploadFileDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-800"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 rounded-lg border border-white/10 bg-white/5">
                <FileText className="mb-2 h-12 w-12 text-white/30" />
                <h3 className="mb-1 text-xl font-medium text-white">No resources yet</h3>
                <p className="text-white/70">
                  There are no resources uploaded for this class
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Post Notice Dialog (CR only) */}
      {isUserCR && (
        <Dialog open={isPostNoticeDialogOpen} onOpenChange={setIsPostNoticeDialogOpen}>
          <DialogContent className="bg-cuet-navy border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Post a Notice</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-white">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={noticeForm.title}
                  onChange={handleNoticeInputChange}
                  placeholder="Notice title"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-white">
                  Content
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={noticeForm.content}
                  onChange={handleNoticeInputChange}
                  placeholder="Notice content"
                  className="min-h-[100px] bg-white/5 border-white/10 text-white placeholder:text-white/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPostNoticeDialogOpen(false)}
                className="bg-white/5 text-white hover:bg-white/10 border-white/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePostNotice}
                className="bg-gradient-to-r from-blue-600 to-blue-800"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Post Notice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Upload File Dialog (CR only) */}
      {isUserCR && (
        <Dialog open={isUploadFileDialogOpen} onOpenChange={setIsUploadFileDialogOpen}>
          <DialogContent className="bg-cuet-navy border border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Upload Resource</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="resource-file" className="text-white">
                  Select File
                </Label>
                <Input
                  id="resource-file"
                  type="file"
                  onChange={handleFileChange}
                  className="bg-white/5 border-white/10 text-white file:bg-blue-600 file:text-white file:border-0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUploadFileDialogOpen(false)}
                className="bg-white/5 text-white hover:bg-white/10 border-white/10"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUploadFile}
                className="bg-gradient-to-r from-blue-600 to-blue-800"
                disabled={!selectedFile}
              >
                <File className="mr-2 h-4 w-4" />
                Upload File
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default ClassDetails;
