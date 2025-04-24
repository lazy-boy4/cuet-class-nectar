
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  Calendar, 
  CheckCircle2, 
  File, 
  Info, 
  Loader2, 
  MessageSquarePlus, 
  Save, 
  Send, 
  Upload, 
  UserCheck, 
  X 
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
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { mockClasses } from "@/api/mockData/classes";
import { mockUsers } from "@/api/mockData/users";
import { mockAttendance } from "@/api/mockData/attendance";
import { mockSchedules } from "@/api/mockData/schedules";
import { Class, User } from "@/types";

const TeacherClassManagement = () => {
  const { classId } = useParams<{ classId: string }>();
  const { toast } = useToast();
  
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, boolean>>({});
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  
  // Load class data and students
  useEffect(() => {
    const loadClassData = async () => {
      setIsLoading(true);
      
      try {
        // Find the class from mock data
        const foundClass = mockClasses.find(c => c.id === classId);
        
        if (foundClass) {
          setCurrentClass(foundClass);
          
          // Find students in this class (in a real app, this would be based on enrollments)
          const classStudents = mockUsers.filter(user => (
            user.role === "student" && 
            user.department === foundClass.department &&
            user.session === foundClass.session &&
            user.section === foundClass.section
          ));
          
          setStudents(classStudents);
          
          // Initialize attendance records (all present by default)
          const initialAttendance: Record<string, boolean> = {};
          classStudents.forEach(student => {
            initialAttendance[student.id] = true;
          });
          
          setAttendanceRecords(initialAttendance);
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
  
  // Handle attendance toggle
  const handleAttendanceToggle = (studentId: string, isPresent: boolean) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };
  
  // Handle save attendance
  const handleSaveAttendance = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, this would send the data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Attendance Saved",
        description: `Attendance for ${attendanceDate} has been recorded successfully.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save attendance. Please try again.",
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
  
  // Handle attendance report generation
  const handleGenerateAttendanceReport = () => {
    setIsAlertDialogOpen(true);
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
            <Link to="/teacher/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  // Calculate stats
  const attendanceRate = mockAttendance.length > 0 
    ? Math.round((mockAttendance.filter(a => a.isPresent).length / mockAttendance.length) * 100) 
    : 0;
  
  return (
    <DashboardLayout
      title={`${currentClass.courseName} (${currentClass.courseCode})`}
      description={`${currentClass.department} - ${currentClass.session} - Section ${currentClass.section}`}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard 
          title="Students"
          value={students.length.toString()}
          icon={UserCheck}
          color="from-blue-600 to-blue-800"
        />
        <StatCard 
          title="Average Attendance"
          value={`${attendanceRate}%`}
          icon={CheckCircle2}
          color="from-green-600 to-green-800"
        />
        <StatCard 
          title="Classes Completed"
          value={mockSchedules.filter(s => new Date(s.date) < new Date()).length.toString()}
          icon={Calendar}
          color="from-purple-600 to-purple-800"
        />
      </div>
      
      <div className="mt-8">
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="notices">Notices</TabsTrigger>
            <TabsTrigger value="schedules">Schedules</TabsTrigger>
          </TabsList>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Mark Attendance</CardTitle>
                <div className="flex space-x-2">
                  <Input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-auto border-white/10"
                  />
                  <Button onClick={handleGenerateAttendanceReport} variant="outline">
                    <File className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead className="text-right">Present</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.length > 0 ? (
                      students.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {student.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="text-right">
                            <Checkbox
                              checked={attendanceRecords[student.id] || false}
                              onCheckedChange={(checked) => 
                                handleAttendanceToggle(student.id, checked as boolean)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          <p className="text-white/70">No students found in this class.</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleSaveAttendance}
                    disabled={isSaving || students.length === 0}
                  >
                    {isSaving && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {!isSaving && <Save className="mr-2 h-4 w-4" />}
                    Save Attendance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notices Tab */}
          <TabsContent value="notices" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Post a Notice</CardTitle>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Notices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex justify-between">
                      <h4 className="font-semibold text-white">Final Exam Schedule</h4>
                      <span className="text-xs text-white/50">3 days ago</span>
                    </div>
                    <p className="text-sm text-white/70">
                      The final exam for this course will be held on December 15, 2023, at Room 301, Building B.
                      Please bring your student ID and be present at least 15 minutes before the exam starts.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex justify-between">
                      <h4 className="font-semibold text-white">Assignment Submission</h4>
                      <span className="text-xs text-white/50">1 week ago</span>
                    </div>
                    <p className="text-sm text-white/70">
                      Please submit your assignments by November 30, 2023. Late submissions will not be accepted without proper justification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Schedules Tab */}
          <TabsContent value="schedules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Schedule</CardTitle>
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
            
            <Card>
              <CardHeader>
                <CardTitle>Class Schedule</CardTitle>
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
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Attendance Report Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate Attendance Report</AlertDialogTitle>
            <AlertDialogDescription>
              This will generate a downloadable attendance report for all students in this class.
              Do you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast({
                  title: "Report Generated",
                  description: "Attendance report has been generated and is ready to download.",
                });
                setIsAlertDialogOpen(false);
              }}
            >
              Generate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default TeacherClassManagement;
