import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockCourses } from "@/api/mockData/courses";
import { mockDepartments } from "@/api/mockData/departments";
import CourseTable from "@/components/admin/CourseTable";
import CourseForm from "@/components/admin/CourseForm";
import { toast } from "@/hooks/use-toast";
import { Course, Department } from "@/types";
import { Link } from "react-router-dom";

const QuickAdminNav = () => (
  <nav className="mb-8 flex flex-wrap gap-3">
    <Link to="/admin/dashboard" className="btn-secondary">Dashboard</Link>
    <Link to="/admin/departments" className="btn-secondary">Departments</Link>
    <Link to="/admin/courses" className="btn-secondary">Courses</Link>
    <Link to="/admin/classes" className="btn-secondary">Classes</Link>
    <Link to="/admin/users" className="btn-secondary">Users</Link>
    <Link to="/admin/assign-teachers" className="btn-secondary">Assign Teachers</Link>
    <Link to="/admin/promote-crs" className="btn-secondary">Promote CRs</Link>
  </nav>
);

export default function CourseManagement() {
  const [courses, setCourses] = useState(mockCourses);
  const [openForm, setOpenForm] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);

  const getDepartmentName = (departmentId: string | undefined, departmentCode?: string) => {
    const dept = mockDepartments.find(d => d.id === departmentId || d.code === departmentCode);
    return dept ? dept.name : (departmentCode || "Unknown");
  };

  const handleAddOrEditCourse = (data: Omit<Course, "id">) => {
    setLoading(true);
    setTimeout(() => {
      if (editCourse) {
        setCourses(courses.map(c =>
          c.id === editCourse.id ? { ...editCourse, ...data } : c
        ));
        toast({ title: "Updated Course", description: "Course updated successfully." });
      } else {
        setCourses([...courses, { ...data, id: `course-${Date.now()}` }]);
        toast({ title: "Added Course", description: "Course added successfully." });
      }
      setOpenForm(false);
      setEditCourse(null);
      setLoading(false);
    }, 600);
  };

  const handleDelete = (course: Course) => {
    setLoading(true);
    setTimeout(() => {
      setCourses(courses.filter(c => c.id !== course.id));
      toast({ title: "Deleted Course", description: "Course deleted successfully." });
      setLoading(false);
    }, 600);
  };

  return (
    <DashboardLayout title="Course Management" description="Administer university courses.">
      <QuickAdminNav />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-white">Courses</h2>
        <Button onClick={() => { setEditCourse(null); setOpenForm(true); }} variant="secondary" className="gap-2">
          <Plus size={16} /> Add Course
        </Button>
      </div>
      <CourseTable
        courses={courses}
        loading={loading}
        onEdit={course => { setEditCourse(course); setOpenForm(true); }}
        onDelete={handleDelete}
        getDepartmentName={getDepartmentName}
      />
      <CourseForm
        open={openForm}
        onOpenChange={setOpenForm}
        course={editCourse}
        onSubmit={handleAddOrEditCourse}
        departments={mockDepartments}
        loading={loading}
      />
    </DashboardLayout>
  );
}
