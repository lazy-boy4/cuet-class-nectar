
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Calendar, 
  Bell, 
  Upload, 
  Check, 
  X, 
  Clock,
  FileText,
  Send
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { mockClasses } from "@/api/mockData/classes";
import { mockUsers } from "@/api/mockData/users";
import { mockAttendance } from "@/api/mockData/attendance";

const TeacherClassManagement = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddNoticeDialogOpen, setIsAddNoticeDialogOpen] = useState(false);
  const [isUploadScheduleDialogOpen, setIsUploadScheduleDialogOpen] = useState(false);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  
  // Notice form
  const [noticeForm, setNoticeForm] = useState({
    title: "",
    content: ""
  });
  
  // Attendance tracking
  const [studentAttendance, setStudentAttendance] = useState<{
    [studentId: string]: "present" | "absent" | "late";
  }>({});
  const [attendanceChanged, setAttendanceChanged] = useState(false);
  
  useEffect(() => {
    document.title = "Class Management - CUET Class Management System";
    
    // Check if user is authenticated as teacher
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "teacher") {
      navigate("/login");
      return;
    }
    
    // Check if class exists and teacher is assigned to it
    if (!classId) {
      navigate("/teacher/dashboard");
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
  
  // Get enrolled students
  const { data: enrolledStudents = [] } = useQuery({
    queryKey: ["enrolledStudents", classId],
    queryFn: () => {
      // In a real app, we would fetch enrolled students for this class from an API
      // For now, we'll simulate it with some mock data
      return mockUsers
        .filter(user => user.role === "student")
        .filter(user => user.departmentCode === classDetails?.departmentCode)
        .slice(0, 15); // Take a subset for demonstration
    },
    enabled: !!classDetails,
  });
  
  // Get attendance records
  const { data: attendanceRecords = [] } = useQuery({
    queryKey: ["attendanceRecords", classId, attendanceDate],
    queryFn: async () => {
      // In a real app, we would fetch attendance records for this class and date
      // For now, we'll use mock data
      return mockAttendance.filter(record => 
        record.classId === classId && 
        record.date === attendanceDate
      );
    },
    enabled: !!classId && !!attendanceDate,
  });
  
  // Initialize attendance from records
  useEffect(() => {
    if (enrolledStudents.length > 0 && attendanceRecords.length > 0) {
      const initialAttendance: {[key: string]: "present" | "absent" | "late"} = {};
      
      enrolledStudents.forEach(student => {
        const record = attendanceRecords.find(r => r.studentId === student.id);
        initialAttendance[student.id] = record ? record.status : "absent";
      });
      
      setStudentAttendance(initialAttendance);
      setAttendanceChanged(false);
    } else if (enrolledStudents.length > 0) {
      // No records found for this date, initialize all as absent
      const initialAttendance: {[key: string]: "present" | "absent" | "late"} = {};
      
      enrolledStudents.forEach(student => {
        initialAttendance[student.id] = "absent";
      });
      
      setStudentAttendance(initialAttendance);
      setAttendanceChanged(false);
    }
  }, [enrolledStudents, attendanceRecords]);
  
  // Handle notice form input changes
  const handleNoticeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNoticeForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle attendance change for a student
  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "late") => {
    setStudentAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
    setAttendanceChanged(true);
  };
  
  // Handle file selection for schedule
  const handleScheduleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScheduleFile(e.target.files[0]);
    }
  };
  
  // Handle submitting attendance
  const handleSubmitAttendance = () => {
    // In a real app, we would send this to an API
    toast({
      title: "Success",
      description: "Attendance has been saved for " + attendanceDate,
    });
    setAttendanceChanged(false);
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
    setIsAddNoticeDialogOpen(false);
  };
  
  // Handle uploading a schedule
  const handleUploadSchedule = () => {
    if (!scheduleFile) {
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
      description: `Schedule "${scheduleFile.name}" has been uploaded`,
    });
    
    setScheduleFile(null);
    setIsUploadScheduleDialogOpen(false);
  };

  if (!classDetails) {
    return (
      <DashboardLayout
        title="Class Management"
        description="Manage class activities"
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
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5">
          <TabsTrigger value="attendance">
            <Users className="mr-2 h-4 w-4" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="notices">
            <Bell className="mr-2 h-4 w-4" /> Notices
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="mr-2 h-4 w-4" /> Schedule
          </TabsTrigger>
        </TabsList>
        
        {/* Attendance Tab */}
        <TabsContent value="attendance" className="mt-6 space-y-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div>Attendance Tracker</div>
                <Input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="w-auto bg-white/5 border-white/10 text-white"
                />
              </CardTitle>
              <CardDescription>
                Mark attendance for {enrolledStudents.length} students in this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-white">Student</TableHead>
                      <TableHead className="text-white">ID</TableHead>
                      <TableHead className="text-white">Present</TableHead>
                      <TableHead className="text-white">Absent</TableHead>
                      <TableHead className="text-white">Late</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrolledStudents.length === 0 ? (
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableCell
                          colSpan={5}
                          className="h-24 text-center text-white/70"
                        >
                          No students enrolled in this class
                        </TableCell>
                      </TableRow>
                    ) : (
                      enrolledStudents.map((student) => (
                        <TableRow 
                          key={student.id} 
                          className="border-white/10 hover:bg-white/5"
                        >
                          <TableCell className="font-medium text-white">
                            {student.name}
                          </TableCell>
                          <TableCell className="text-white/80">
                            {student.id.substring(0, 8)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                className={`rounded-full p-1 ${
                                  studentAttendance[student.id] === "present" 
                                    ? "bg-green-600 text-white" 
                                    : "bg-white/10 text-white/50"
                                }`}
                                onClick={() => handleAttendanceChange(student.id, "present")}
                              >
                                <Check className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                className={`rounded-full p-1 ${
                                  studentAttendance[student.id] === "absent" 
                                    ? "bg-red-600 text-white" 
                                    : "bg-white/10 text-white/50"
                                }`}
                                onClick={() => handleAttendanceChange(student.id, "absent")}
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                className={`rounded-full p-1 ${
                                  studentAttendance[student.id] === "late" 
                                    ? "bg-yellow-600 text-white" 
                                    : "bg-white/10 text-white/50"
                                }`}
                                onClick={() => handleAttendanceChange(student.id, "late")}
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  onClick={handleSubmitAttendance}
                  className="bg-gradient-to-r from-blue-600 to-blue-800"
                  disabled={!attendanceChanged}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notices Tab */}
        <TabsContent value="notices" className="mt-6 space-y-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Class Notices</CardTitle>
                <Button 
                  onClick={() => setIsAddNoticeDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-800"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Post Notice
                </Button>
              </div>
              <CardDescription>
                Post announcements for students in this class
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <Bell className="mb-2 h-12 w-12 text-white/30" />
                  <h3 className="mb-1 text-xl font-medium text-white">No notices yet</h3>
                  <p className="text-white/70">
                    Use the "Post Notice" button to create announcements for your class
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="mt-6 space-y-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Class Schedule</CardTitle>
                <Button 
                  onClick={() => setIsUploadScheduleDialogOpen(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-800"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Schedule
                </Button>
              </div>
              <CardDescription>
                Manage and share class schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="mb-2 h-12 w-12 text-white/30" />
                  <h3 className="mb-1 text-xl font-medium text-white">No schedule uploaded</h3>
                  <p className="text-white/70">
                    Upload a schedule to share with students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Notice Dialog */}
      <Dialog open={isAddNoticeDialogOpen} onOpenChange={setIsAddNoticeDialogOpen}>
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
              onClick={() => setIsAddNoticeDialogOpen(false)}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePostNotice}
              className="bg-gradient-to-r from-blue-600 to-blue-800"
            >
              <Send className="mr-2 h-4 w-4" />
              Post Notice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upload Schedule Dialog */}
      <Dialog open={isUploadScheduleDialogOpen} onOpenChange={setIsUploadScheduleDialogOpen}>
        <DialogContent className="bg-cuet-navy border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Schedule</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="schedule-file" className="text-white">
                Schedule File (PDF or Image)
              </Label>
              <Input
                id="schedule-file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleScheduleFileChange}
                className="bg-white/5 border-white/10 text-white file:bg-blue-600 file:text-white file:border-0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadScheduleDialogOpen(false)}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUploadSchedule}
              className="bg-gradient-to-r from-blue-600 to-blue-800"
              disabled={!scheduleFile}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeacherClassManagement;
