
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Class, Department, Course } from "@/types";

interface ClassFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classItem: Class | null;
  onSubmit: (data: Omit<Class, "id">) => void;
  departments: Department[];
  courses: Course[];
  loading: boolean;
}

const ClassForm = ({ 
  open, 
  onOpenChange, 
  classItem, 
  onSubmit, 
  departments, 
  courses, 
  loading 
}: ClassFormProps) => {
  const [formData, setFormData] = useState({
    departmentCode: "",
    courseId: "",
    section: "",
    session: "",
    teacherId: "",
  });

  useEffect(() => {
    if (classItem) {
      setFormData({
        departmentCode: classItem.departmentCode,
        courseId: classItem.courseId,
        section: classItem.section,
        session: classItem.session,
        teacherId: classItem.teacherId || "",
      });
    } else {
      setFormData({
        departmentCode: "",
        courseId: "",
        section: "",
        session: "",
        teacherId: "",
      });
    }
  }, [classItem, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const filteredCourses = courses.filter(
    course => course.departmentCode === formData.departmentCode
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>
            {classItem ? "Edit Class" : "Add New Class"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.departmentCode}
              onValueChange={(value) => setFormData({ 
                ...formData, 
                departmentCode: value,
                courseId: "" // Reset course when department changes
              })}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/10">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.code} className="text-white">
                    {dept.code} - {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select
              value={formData.courseId}
              onValueChange={(value) => setFormData({ ...formData, courseId: value })}
              disabled={!formData.departmentCode}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/10">
                {filteredCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id} className="text-white">
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                placeholder="A, B, C..."
                className="bg-white/5 border-white/10"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="session">Session</Label>
              <Input
                id="session"
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                placeholder="2023-24"
                className="bg-white/5 border-white/10"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Saving..." : classItem ? "Update Class" : "Add Class"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassForm;
