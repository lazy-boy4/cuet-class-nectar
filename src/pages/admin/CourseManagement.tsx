
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDepartments } from "@/api/mockData/departments"; // Keep for dropdown usage
import CourseTable from "@/components/admin/CourseTable";
import CourseForm from "@/components/admin/CourseForm";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import { toast } from "@/hooks/use-toast";
import { Course } from "@/types";
import { Link } from "react-router-dom";
import { fetchCoursesForAdmin, createCourse, updateCourse, deleteCourse, fetchDepartmentsForAdmin } from "@/api/admin";

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
  const [openForm, setOpenForm] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourseObj, setDeleteCourseObj] = useState<Course | null>(null);

  const queryClient = useQueryClient();

  // Fetch courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCoursesForAdmin,
  });

  // Fetch departments for mapping name (or use mock if not available yet)
  const { data: departments = mockDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartmentsForAdmin,
  });

  const getDepartmentName = (departmentId: string | undefined, departmentCode?: string) => {
    // Try to find by ID first, then Code
    const dept = departments.find(d => d.id === departmentId || d.code === departmentCode || d.code === departmentId);
    return dept ? dept.name : (departmentCode || "Unknown");
  };

  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      toast({ title: "Added Course", description: "Course added successfully." });
      setOpenForm(false);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to add course.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: () => {
      toast({ title: "Updated Course", description: "Course updated successfully." });
      setOpenForm(false);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to update course.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      toast({ title: "Deleted Course", description: "Course deleted successfully." });
      setDeleteCourseObj(null);
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to delete course.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const handleAddOrEditCourse = (data: Omit<Course, "id">) => {
    if (editCourse) {
      updateMutation.mutate({ ...data, id: editCourse.id } as Course);
    } else {
      createMutation.mutate(data);
    }
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
        loading={isLoading}
        onEdit={course => { setEditCourse(course); setOpenForm(true); }}
        onDelete={setDeleteCourseObj}
        getDepartmentName={getDepartmentName}
      />
      <CourseForm
        open={openForm}
        onOpenChange={setOpenForm}
        course={editCourse}
        onSubmit={handleAddOrEditCourse}
        departments={departments}
        loading={createMutation.isPending || updateMutation.isPending}
      />
      <ConfirmDeleteDialog
        open={!!deleteCourseObj}
        onOpenChange={(v) => !v && setDeleteCourseObj(null)}
        title="Delete Course"
        description={<>Are you sure you want to delete <span className="font-semibold text-white">{deleteCourseObj?.name}</span> ({deleteCourseObj?.code})? This action cannot be undone.</>}
        onConfirm={() => deleteCourseObj && deleteMutation.mutate(deleteCourseObj.id)}
        loading={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}
