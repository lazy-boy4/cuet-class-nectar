
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  Book,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Info, 
  Loader2, 
  MessageSquarePlus,
  Save,
  Upload,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockClasses } from "@/api/mockData/classes";
import { mockUsers } from "@/api/mockData/users";
import { mockSchedules } from "@/api/mockData/schedules";
import { mockAttendance } from "@/api/mockData/attendance";
import { mockNotices } from "@/api/mockData/notices";
import { mockEnrollments } from "@/api/mockData/enrollments";

const ClassDetails = () => {
  const { classId } = useParams<{ classId: string }>();
  const { toast } = useToast();
  
  const [currentClass, setCurrentClass] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUserCR, setIsCurrentUserCR] = useState(false);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [enrollmentRequests, setEnrollmentRequests] = useState<any[]>([]);
  const [testDate, setTestDate] = useState("");
  const [testDescription, setTestDescription] = useState("");
  
  // Load class data
  useEffect(() => {
    const loadClassData = async () => {
      setIsLoading(true);
      
      try {
        // Find the class from mock data
        const foundClass = mockClasses.find(c => c.id === classId);
        
        if (foundClass) {
          setCurrentClass(foundClass);
          
          // In a real app, this would be the current logged-in user
          const currentUser = mockUsers.find(u => u.role === "student");
          
          // Check if the current user is a CR
          if (currentUser) {
            setIsCurrentUserCR(Boolean(currentUser.isClassRepresentative));
            
            // Get enrollment requests for CR (in a real app, filter by class)
            if (currentUser.isClassRepresentative) {
              // Mock enrollment requests that are pending
              const requests = mockEnrollments.filter(e => e.status === "pending");
              setEnrollmentRequests(requests);
            }
          }
        }
      } catch (error) {
        console.error("Error loading class data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load class data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClassData();
  }, [classId, toast]);
  
  // Handle schedule file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScheduleFile(e.target.files[0]);
    }
  };
  
  // Handle upload schedule
  const handleUploadSchedule = async () => {
    if (!scheduleFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload.",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real app, this would upload the file to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Schedule Uploaded",
        description: `Schedule file "${scheduleFile.name}" has been uploaded successfully.`,
      });
      
      // Reset file input
      setScheduleFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload schedule. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle post notice
  const handlePostNotice = async () => {
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide both title and content for the notice.",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real app, this would send the data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Notice Posted",
        description: "Your notice has been posted successfully.",
      });
      
      // Reset form
      setNoticeTitle("");
      setNoticeContent("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post notice. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle setting test date
  const handleSetTestDate = async () => {
    if (!testDate || !testDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide both date and description for the test.",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // In a real app, this would send the data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Test Date Set",
        description: `Test "${testDescription}" has been scheduled for ${testDate}.`,
      });
      
      // Reset form
      setTestDate("");
      setTestDescription("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set test date. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle enrollment request action
  const handleEnrollmentAction = async (enrollmentId: string, action: "approve" | "reject") => {
    setIsSaving(true);
    
    try {
      // In a real app, this would send the data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setEnrollmentRequests(prev => 
        prev.filter(request => request.id !== enrollmentId)
      );
      
      toast({
        title: `Enrollment ${action === "approve" ? "Approved" : "Rejected"}`,
        description: `The enrollment request has been ${action === "approve" ? "approved" : "rejected"}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${action} enrollment request. Please try again.`,
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." description="Please wait">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-500" />
          <span className="text-lg text-white/70">Loading class data...</span>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!currentClass) {
    return (
      <DashboardLayout title="Error" description="Class not found">
        <div className="flex h-64 flex-col items-center justify-center">
          <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-white">Class Not Found</h2>
          <p className="text-white/70">
            The class you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button className="mt-4" asChild>
            <Link to="/student/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  // Get attendance for current student (in a real app, this would be filtered by student ID)
  const studentAttendance = mockAttendance.filter(a => a.classId === currentClass.id);
  const attendancePercentage = studentAttendance.length > 0
    ? Math.round((studentAttendance.filter(a => a.isPresent).length / studentAttendance.length) * 100)
    : 0;
  
  // Filter notices for this class
  const classNotices = mockNotices.filter(notice => notice.classId === currentClass.id);
  
  return (
    <DashboardLayout
      title={`${currentClass.courseName}`}
      description={`${currentClass.courseCode} - ${currentClass.department} ${currentClass.session} Sec ${currentClass.section}`}
    >
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Course Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-white/60">Course Code:</span>
              <span className="font-medium text-white">{currentClass.courseCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/60">Department:</span>
              <span className="font-medium text-white">{currentClass.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/60">Session:</span>
              <span className="font-medium text-white">{currentClass.session}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/60">Section:</span>
              <span className="font-medium text-white">{currentClass.section}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-white/60">Credits:</span>
              <span className="font-medium text-white">3</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Your Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">{attendancePercentage}%</span>
              <Badge 
                variant={attendancePercentage >= 75 ? "default" : "destructive"}
                className="ml-2"
              >
                {attendancePercentage >= 75 ? "Good Standing" : "At Risk"}
              </Badge>
            </div>
            <Progress value={attendancePercentage} className="h-2" />
            <p className="text-xs text-white/60">
              {attendancePercentage >= 75 
                ? "You're maintaining good attendance." 
                : "Warning: Your attendance is below the required 75%."}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start space-x-3">
              <Calendar className="mt-0.5 h-4 w-4 text-blue-400" />
              <div>
                <p className="font-medium text-white">Midterm Exam</p>
                <p className="text-xs text-white/60">October 15, 2023</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FileText className="mt-0.5 h-4 w-4 text-green-400" />
              <div>
                <p className="font-medium text-white">Assignment Due</p>
                <p className="text-xs text-white/60">November 5, 2023</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Book className="mt-0.5 h-4 w-4 text-purple-400" />
              <div>
                <p className="font-medium text-white">Chapter 7 Quiz</p>
                <p className="text-xs text-white/60">November 12, 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
        </TabsList>
        
        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>
                Your attendance history for this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttendance.length > 0 ? (
                    studentAttendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {record.isPresent ? (
                            <div className="flex items-center">
                              <Check className="mr-2 h-4 w-4 text-green-500" />
                              <span className="text-green-400">Present</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <X className="mr-2 h-4 w-4 text-red-500" />
                              <span className="text-red-400">Absent</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {record.note ? record.note : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Info className="mb-2 h-8 w-8 text-blue-400" />
                          <p className="text-white/70">No attendance records found.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>
                Upcoming and past classes for this course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Topic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSchedules.length > 0 ? (
                    mockSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          {new Date(schedule.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{schedule.time}</TableCell>
                        <TableCell>{schedule.room}</TableCell>
                        <TableCell>{schedule.topic}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Info className="mb-2 h-8 w-8 text-blue-400" />
                          <p className="text-white/70">No schedules have been added yet.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {isCurrentUserCR && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Schedule (CR Only)</CardTitle>
                <CardDescription>
                  As a Class Representative, you can upload schedules for this class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Upload Schedule File
                    </label>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="border-white/10"
                    />
                    <p className="text-xs text-white/50">
                      Accepted formats: PDF, DOC, DOCX, XLS, XLSX
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleUploadSchedule}
                      disabled={isSaving || !scheduleFile}
                    >
                      {isSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {!isSaving && <Upload className="mr-2 h-4 w-4" />}
                      Upload Schedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Notices Tab */}
        <TabsContent value="notices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Class Notices</CardTitle>
              <CardDescription>
                Important announcements for this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classNotices.length > 0 ? (
                  classNotices.map((notice) => (
                    <div key={notice.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <div className="mb-2 flex justify-between">
                        <h4 className="font-semibold text-white">{notice.title}</h4>
                        <span className="text-xs text-white/50">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70">{notice.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Info className="mb-2 h-8 w-8 text-blue-400" />
                    <p className="text-white/70">No notices have been posted yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {isCurrentUserCR && (
            <Card>
              <CardHeader>
                <CardTitle>Post Notice (CR Only)</CardTitle>
                <CardDescription>
                  As a Class Representative, you can post notices for this class
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="notice-title" className="text-sm font-medium">
                      Title
                    </label>
                    <Input
                      id="notice-title"
                      placeholder="Enter notice title"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      className="border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="notice-content" className="text-sm font-medium">
                      Content
                    </label>
                    <Textarea
                      id="notice-content"
                      placeholder="Enter notice content"
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                      rows={5}
                      className="border-white/10"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handlePostNotice}
                      disabled={isSaving || !noticeTitle.trim() || !noticeContent.trim()}
                    >
                      {isSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {!isSaving && <MessageSquarePlus className="mr-2 h-4 w-4" />}
                      Post Notice
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      {/* CR Specific Features */}
      {isCurrentUserCR && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold text-white">Class Representative Tools</h2>
          
          {/* Enrollment Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Requests</CardTitle>
              <CardDescription>
                Manage enrollment requests from students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Date Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollmentRequests.length > 0 ? (
                    enrollmentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">
                          {request.studentName}
                        </TableCell>
                        <TableCell>
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-green-700 bg-green-700/20 text-green-400 hover:bg-green-700/30 hover:text-green-300"
                              onClick={() => handleEnrollmentAction(request.id, "approve")}
                              disabled={isSaving}
                            >
                              <Check className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-red-700 bg-red-700/20 text-red-400 hover:bg-red-700/30 hover:text-red-300"
                              onClick={() => handleEnrollmentAction(request.id, "reject")}
                              disabled={isSaving}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-16 text-center">
                        <p className="text-white/70">No pending enrollment requests</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          {/* Set Test Dates */}
          <Card>
            <CardHeader>
              <CardTitle>Set Test Dates</CardTitle>
              <CardDescription>
                Schedule exams, quizzes, and assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="test-date" className="text-sm font-medium">
                      Date
                    </label>
                    <Input
                      id="test-date"
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
                      className="border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="test-description" className="text-sm font-medium">
                      Description
                    </label>
                    <Input
                      id="test-description"
                      placeholder="e.g., Midterm Exam, Quiz 2, Assignment 3"
                      value={testDescription}
                      onChange={(e) => setTestDescription(e.target.value)}
                      className="border-white/10"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSetTestDate}
                      disabled={isSaving || !testDate || !testDescription.trim()}
                    >
                      {isSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {!isSaving && <Calendar className="mr-2 h-4 w-4" />}
                      Set Test Date
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <h4 className="mb-3 font-semibold text-white">Upcoming Tests</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-orange-400" />
                        <span className="text-sm text-white">Midterm Exam</span>
                      </div>
                      <span className="text-xs text-white/60">Oct 15, 2023</span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-blue-400" />
                        <span className="text-sm text-white">Quiz 3</span>
                      </div>
                      <span className="text-xs text-white/60">Nov 5, 2023</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-purple-400" />
                        <span className="text-sm text-white">Final Exam</span>
                      </div>
                      <span className="text-xs text-white/60">Dec 20, 2023</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClassDetails;
