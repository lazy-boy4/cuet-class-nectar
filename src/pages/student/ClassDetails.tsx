
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Download, File, Loader2, Upload } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { mockClasses } from "@/api/mockData/classes";
import { mockAttendance } from "@/api/mockData/attendance";
import { mockSchedules } from "@/api/mockData/schedules";
import { mockNotices } from "@/api/mockData/notices";
import { Attendance, Class } from "@/types";

const ClassDetails = () => {
  const { classId } = useParams<{ classId: string }>();
  const { toast } = useToast();
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  const [testDate, setTestDate] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock data - in a real app, this would come from API calls
  const currentClass = mockClasses.find(c => c.id === classId);
  const isClassRepresentative = true; // Mock value - in a real app, check if current user is CR

  // Get attendance for this class
  const classAttendance = mockAttendance.filter(
    a => a.classId === classId
  );
  
  // Calculate attendance percentage
  const totalClasses = classAttendance.length;
  const attendedClasses = classAttendance.filter(a => a.status === "present").length;
  const attendancePercentage = totalClasses > 0 
    ? Math.round((attendedClasses / totalClasses) * 100)
    : 0;
  
  // Get class schedules
  const classSchedules = mockSchedules.filter(
    s => s.classId === classId
  );
  
  // Get class notices
  const classNotices = mockNotices.filter(
    n => n.classId === classId
  );
  
  // Handle notice submission
  const handleSubmitNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!noticeTitle.trim() || !noticeContent.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both a title and content for the notice.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
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
      setIsSubmitting(false);
    }
  };
  
  // Handle schedule upload
  const handleScheduleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduleFile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send the file to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Schedule Uploaded",
        description: `File "${scheduleFile.name}" has been uploaded successfully.`,
      });
      
      // Reset form
      setScheduleFile(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload schedule. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle test date submission
  const handleSubmitTestDate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testDate || !testDescription.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide both a date and description for the test.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send the data to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Test Date Set",
        description: `Test scheduled for ${testDate} has been set successfully.`,
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
      setIsSubmitting(false);
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScheduleFile(e.target.files[0]);
    }
  };
  
  if (!currentClass) {
    return (
      <DashboardLayout
        title="Class Not Found"
        description="The class you're looking for doesn't exist or you don't have access to it."
      >
        <div className="flex justify-center mt-8">
          <Button asChild>
            <Link to="/student/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout
      title={currentClass.courseName}
      description={`${currentClass.courseCode} - Section ${currentClass.section}`}
    >
      <div className="mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">Your Attendance</h3>
                <div className="mt-2 flex items-center">
                  <p className="mr-2 text-2xl font-bold text-white">{attendancePercentage}%</p>
                  {attendancePercentage >= 90 ? (
                    <span className="rounded bg-green-200 px-2 py-1 text-xs font-medium text-green-800">
                      Excellent
                    </span>
                  ) : attendancePercentage >= 75 ? (
                    <span className="rounded bg-yellow-200 px-2 py-1 text-xs font-medium text-yellow-800">
                      Good
                    </span>
                  ) : (
                    <span className="rounded bg-red-200 px-2 py-1 text-xs font-medium text-red-800">
                      Needs Improvement
                    </span>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <Progress value={attendancePercentage} className="h-2" />
                <p className="mt-1 text-sm text-white/70">
                  {attendedClasses} out of {totalClasses} classes attended
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classAttendance.length > 0 ? (
                    classAttendance.map((record: Attendance) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                              record.status === "present"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {record.status === "present" ? (
                              <>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Present
                              </>
                            ) : (
                              "Absent"
                            )}
                          </span>
                        </TableCell>
                        <TableCell className="text-white/70">
                          {"-"} {/* No comments field in Attendance type */}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center text-white/70"
                      >
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notices" className="space-y-4">
          {isClassRepresentative && (
            <Card>
              <CardHeader>
                <CardTitle>Post a Notice (CR Only)</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitNotice} className="space-y-4">
                  <div>
                    <label
                      htmlFor="notice-title"
                      className="mb-2 block text-sm font-medium"
                    >
                      Title
                    </label>
                    <Input
                      id="notice-title"
                      value={noticeTitle}
                      onChange={(e) => setNoticeTitle(e.target.value)}
                      placeholder="Enter notice title"
                      className="border-white/10"
                    />
                  </div>
                  
                  <div>
                    <label
                      htmlFor="notice-content"
                      className="mb-2 block text-sm font-medium"
                    >
                      Content
                    </label>
                    <Textarea
                      id="notice-content"
                      value={noticeContent}
                      onChange={(e) => setNoticeContent(e.target.value)}
                      placeholder="Enter notice content"
                      rows={4}
                      className="border-white/10"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Notice"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Class Notices</CardTitle>
            </CardHeader>
            <CardContent>
              {classNotices.length > 0 ? (
                <div className="space-y-4">
                  {classNotices.map((notice) => (
                    <div
                      key={notice.id}
                      className="rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">
                          {notice.title}
                        </h3>
                        <span className="text-sm text-white/50">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-white/70">{notice.content}</p>
                      <div className="mt-2 text-sm text-white/50">
                        Posted by: {notice.creatorName || "Unknown"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center text-white/50">
                  No notices available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-4">
          {isClassRepresentative && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Upload Class Schedule (CR Only)</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleScheduleUpload} className="space-y-4">
                    <div>
                      <label
                        htmlFor="schedule-file"
                        className="mb-2 block text-sm font-medium"
                      >
                        Schedule File (PDF, DOCX)
                      </label>
                      <Input
                        id="schedule-file"
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,.doc,.xlsx,.xls"
                        className="border-white/10"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full md:w-auto"
                      disabled={isSubmitting || !scheduleFile}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Schedule
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Set Test Date (CR Only)</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTestDate} className="space-y-4">
                    <div>
                      <label
                        htmlFor="test-date"
                        className="mb-2 block text-sm font-medium"
                      >
                        Test Date
                      </label>
                      <Input
                        id="test-date"
                        type="date"
                        value={testDate}
                        onChange={(e) => setTestDate(e.target.value)}
                        className="border-white/10"
                      />
                    </div>
                    
                    <div>
                      <label
                        htmlFor="test-description"
                        className="mb-2 block text-sm font-medium"
                      >
                        Description
                      </label>
                      <Input
                        id="test-description"
                        value={testDescription}
                        onChange={(e) => setTestDescription(e.target.value)}
                        placeholder="E.g., Midterm, Quiz 1, etc."
                        className="border-white/10"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting...
                        </>
                      ) : (
                        "Set Test Date"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Class Schedule</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Schedule
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Topic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classSchedules.length > 0 ? (
                    classSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          {`${schedule.day}, ${schedule.startTime}`}
                        </TableCell>
                        <TableCell>{schedule.room}</TableCell>
                        <TableCell>{"Class Session"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center text-white/70"
                      >
                        No schedule entries available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Downloadable Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center">
                    <File className="mr-2 h-5 w-5 text-blue-400" />
                    <span>Course Syllabus</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center">
                    <File className="mr-2 h-5 w-5 text-blue-400" />
                    <span>Lecture Notes - Week 1</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ClassDetails;
