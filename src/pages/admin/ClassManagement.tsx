

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockDepartments } from "@/api/mockData/departments"; // fallback
import { mockCourses } from "@/api/mockData/courses"; // fallback
import ClassTable from "@/components/admin/ClassTable";
import ClassForm from "@/components/admin/ClassForm";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import { toast } from "@/hooks/use-toast";
import { Class } from "@/types";
import { Link } from "react-router-dom";
import { fetchClassesForAdmin, createClass, updateClass, deleteClass, fetchDepartmentsForAdmin, fetchCoursesForAdmin } from "@/api/admin";

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

export default function ClassManagement() {
  const [openForm, setOpenForm] = useState(false);
  const [editClass, setEditClass] = useState<Class | null>(null);
  const [deleteClassObj, setDeleteClassObj] = useState<Class | null>(null);

  const queryClient = useQueryClient();

  // Fetch departments and courses for dropdowns and lookups
  const { data: departments = mockDepartments } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartmentsForAdmin,
  });

  const { data: courses = mockCourses } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCoursesForAdmin,
  });

  // Fetch classes
  const { data: classesRaw = [], isLoading } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClassesForAdmin,
  });

  // Enriched classes with course names if backend doesn't provide them
  const classes = classesRaw.map(cls => {
    const course = courses.find(c => c.id === cls.courseId);
    return {
      ...cls,
      courseName: cls.courseName || course?.name,
      courseCode: cls.courseCode || course?.code,
    };
  });

  const createMutation = useMutation({
    mutationFn: createClass,
    onSuccess: () => {
      toast({ title: "Added Class", description: "Class added successfully." });
      setOpenForm(false);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to add class.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateClass,
    onSuccess: () => {
      toast({ title: "Updated Class", description: "Class updated successfully." });
      setOpenForm(false);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to update class.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClass,
    onSuccess: () => {
      toast({ title: "Deleted Class", description: "Class deleted successfully." });
      setDeleteClassObj(null);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to delete class.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });


  const handleAddOrEditClass = (data: Omit<Class, "id">) => {
    if (editClass) {
      updateMutation.mutate({ ...data, id: editClass.id } as Class);
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <DashboardLayout title="Class Management" description="Organize and manage class schedules and sessions.">
      <QuickAdminNav />
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-white">Classes</h2>
        <Button onClick={() => { setEditClass(null); setOpenForm(true); }} variant="secondary" className="gap-2">
          <Plus size={16} /> Add Class
        </Button>
      </div>
      <ClassTable
        classes={classes}
        loading={isLoading}
        onEdit={classItem => { setEditClass(classItem); setOpenForm(true); }}
        onDelete={setDeleteClassObj}
      />
      <ClassForm
        open={openForm}
        onOpenChange={setOpenForm}
        classItem={editClass}
        onSubmit={handleAddOrEditClass}
        departments={departments}
        courses={courses}
        loading={createMutation.isPending || updateMutation.isPending}
      />
      <ConfirmDeleteDialog
        open={!!deleteClassObj}
        onOpenChange={(v) => !v && setDeleteClassObj(null)}
        title="Delete Class"
        description={<>Are you sure you want to delete <span className="font-semibold text-white">{deleteClassObj?.code}</span>? This action cannot be undone.</>}
        onConfirm={() => deleteClassObj && deleteMutation.mutate(deleteClassObj.id)}
        loading={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}
