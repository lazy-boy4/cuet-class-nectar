
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockClasses } from "@/api/mockData/classes";
import { mockDepartments } from "@/api/mockData/departments";
import { mockCourses } from "@/api/mockData/courses";
import ClassTable from "@/components/admin/ClassTable";
import ClassForm from "@/components/admin/ClassForm";
import { toast } from "@/hooks/use-toast";
import { Class } from "@/types";
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

export default function ClassManagement() {
  const [classes, setClasses] = useState(mockClasses);
  const [openForm, setOpenForm] = useState(false);
  const [editClass, setEditClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddOrEditClass = (data: Omit<Class, "id">) => {
    setLoading(true);
    setTimeout(() => {
      const selectedCourse = mockCourses.find(c => c.id === data.courseId);
      const selectedDept = mockDepartments.find(d => d.code === data.departmentCode);
      
      if (editClass) {
        setClasses(classes.map(c =>
          c.id === editClass.id ? { 
            ...editClass, 
            ...data,
            courseName: selectedCourse?.name,
            courseCode: selectedCourse?.code,
            code: `${data.departmentCode}-${data.section}`,
          } : c
        ));
        toast({ title: "Updated Class", description: "Class updated successfully." });
      } else {
        setClasses([...classes, { 
          ...data, 
          id: `class-${Date.now()}`,
          courseName: selectedCourse?.name,
          courseCode: selectedCourse?.code,
          code: `${data.departmentCode}-${data.section}`,
        }]);
        toast({ title: "Added Class", description: "Class added successfully." });
      }
      setOpenForm(false);
      setEditClass(null);
      setLoading(false);
    }, 600);
  };

  const handleDelete = (classItem: Class) => {
    setLoading(true);
    setTimeout(() => {
      setClasses(classes.filter(c => c.id !== classItem.id));
      toast({ title: "Deleted Class", description: "Class deleted successfully." });
      setLoading(false);
    }, 600);
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
        loading={loading}
        onEdit={classItem => { setEditClass(classItem); setOpenForm(true); }}
        onDelete={handleDelete}
      />
      <ClassForm
        open={openForm}
        onOpenChange={setOpenForm}
        classItem={editClass}
        onSubmit={handleAddOrEditClass}
        departments={mockDepartments}
        courses={mockCourses}
        loading={loading}
      />
    </DashboardLayout>
  );
}
