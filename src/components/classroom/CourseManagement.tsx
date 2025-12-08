import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, UserPlus, X, BookOpen, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ClassroomCourse } from "@/types";
import {
  addCourseToClassroom,
  updateClassroomCourse,
  deleteClassroomCourse,
  assignTeacherToCourse,
  removeTeacherFromCourse,
  getAllTeachers
} from "@/api/classroom";

interface CourseManagementProps {
  classroomId: string;
  courses: ClassroomCourse[];
  isCR: boolean;
  isLoading: boolean;
  onRefetch: () => void;
}

const CourseManagement: React.FC<CourseManagementProps> = ({
  classroomId,
  courses,
  isCR,
  isLoading,
  onRefetch
}) => {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    credits: 3,
  });

  // Fetch all teachers
  const { data: teachers = [] } = useQuery({
    queryKey: ["allTeachers"],
    queryFn: getAllTeachers,
    enabled: isCR,
  });

  // Add course mutation
  const addMutation = useMutation({
    mutationFn: (data: typeof formData) => addCourseToClassroom(classroomId, data),
    onSuccess: () => {
      toast({ title: "Course Added", description: "Course has been added to the classroom" });
      setShowAddDialog(false);
      setFormData({ courseCode: "", courseName: "", credits: 3 });
      onRefetch();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add course", variant: "destructive" });
    },
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: (courseId: string) => deleteClassroomCourse(classroomId, courseId),
    onSuccess: () => {
      toast({ title: "Course Deleted", description: "Course has been removed from the classroom" });
      onRefetch();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete course", variant: "destructive" });
    },
  });

  // Assign teacher mutation
  const assignTeacherMutation = useMutation({
    mutationFn: ({ courseId, teacherId }: { courseId: string; teacherId: string }) =>
      assignTeacherToCourse(classroomId, courseId, teacherId),
    onSuccess: () => {
      toast({ title: "Teacher Assigned", description: "Teacher has been assigned to the course" });
      setShowTeacherDialog(false);
      setSelectedCourse(null);
      onRefetch();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to assign teacher", variant: "destructive" });
    },
  });

  // Remove teacher mutation
  const removeTeacherMutation = useMutation({
    mutationFn: ({ courseId, teacherId }: { courseId: string; teacherId: string }) =>
      removeTeacherFromCourse(classroomId, courseId, teacherId),
    onSuccess: () => {
      toast({ title: "Teacher Removed", description: "Teacher has been removed from the course" });
      onRefetch();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove teacher", variant: "destructive" });
    },
  });

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseCode || !formData.courseName) {
      toast({ title: "Missing Fields", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    addMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-white/10 bg-white/5 animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-white/10 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Course Button (CR only) */}
      {isCR && (
        <div className="flex justify-end">
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-cuet-blue hover:bg-cuet-blue/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Course
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-cuet-navy border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Course</DialogTitle>
                <DialogDescription className="text-white/70">
                  Add a course to this classroom
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseCode" className="text-white">Course Code</Label>
                  <Input
                    id="courseCode"
                    placeholder="e.g., CSE-301"
                    value={formData.courseCode}
                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="courseName" className="text-white">Course Name</Label>
                  <Input
                    id="courseName"
                    placeholder="e.g., Data Structures"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits" className="text-white">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    min={1}
                    max={6}
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addMutation.isPending} className="flex-1 bg-cuet-blue">
                    {addMutation.isPending ? "Adding..." : "Add Course"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <BookOpen className="mb-4 h-12 w-12 text-white/30" />
            <h3 className="text-lg font-semibold text-white mb-2">No Courses Yet</h3>
            <p className="text-white/70 text-center mb-4">
              {isCR
                ? "Add courses to this classroom for students to see"
                : "The CR hasn't added any courses yet"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Course List */}
      {courses.map((course) => (
        <Card key={course.id} className="border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{course.courseCode}</h3>
                  <p className="text-white/70">{course.courseName}</p>
                  <Badge variant="outline" className="mt-1 bg-white/5 text-white/60">
                    {course.credits} Credits
                  </Badge>
                </div>
              </div>

              {isCR && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowTeacherDialog(true);
                    }}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(course.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Assigned Teachers */}
            {course.teachers && course.teachers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-white/50 mb-2">Assigned Teachers:</p>
                <div className="flex flex-wrap gap-2">
                  {course.teachers.map((teacher) => (
                    <Badge
                      key={teacher.id}
                      variant="secondary"
                      className="bg-green-500/10 text-green-400 border-green-500/20"
                    >
                      {teacher.name}
                      {isCR && (
                        <button
                          onClick={() => removeTeacherMutation.mutate({ courseId: course.id, teacherId: teacher.userId })}
                          className="ml-1 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Assign Teacher Dialog */}
      <Dialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog}>
        <DialogContent className="bg-cuet-navy border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Assign Teacher</DialogTitle>
            <DialogDescription className="text-white/70">
              Assign a teacher to {selectedCourse?.courseName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              onValueChange={(teacherId) => {
                if (selectedCourse) {
                  assignTeacherMutation.mutate({ courseId: selectedCourse.id, teacherId });
                }
              }}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseManagement;
