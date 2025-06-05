
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockStudents, mockTeachers } from "@/api/mockData/users";
import { mockDepartments } from "@/api/mockData/departments";
import UserTable from "@/components/admin/UserTable";
import UserForm from "@/components/admin/UserForm";
import { toast } from "@/hooks/use-toast";
import { User } from "@/types";

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

export default function UserManagement() {
  const [students, setStudents] = useState(mockStudents);
  const [teachers, setTeachers] = useState(mockTeachers);
  const [openForm, setOpenForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [currentUserType, setCurrentUserType] = useState<"student" | "teacher">("student");
  const [loading, setLoading] = useState(false);

  const handleAddOrEditUser = (data: Omit<User, "id">) => {
    setLoading(true);
    setTimeout(() => {
      if (editUser) {
        if (data.role === "student") {
          setStudents(students.map(s => s.id === editUser.id ? { ...editUser, ...data } : s));
        } else {
          setTeachers(teachers.map(t => t.id === editUser.id ? { ...editUser, ...data } : t));
        }
        toast({ title: "Updated User", description: "User updated successfully." });
      } else {
        const newUser = { ...data, id: `${data.role}-${Date.now()}` };
        if (data.role === "student") {
          setStudents([...students, newUser]);
        } else {
          setTeachers([...teachers, newUser]);
        }
        toast({ title: "Added User", description: "User added successfully." });
      }
      setOpenForm(false);
      setEditUser(null);
      setLoading(false);
    }, 600);
  };

  const handleDeleteUser = (user: User) => {
    setLoading(true);
    setTimeout(() => {
      if (user.role === "student") {
        setStudents(students.filter(s => s.id !== user.id));
      } else {
        setTeachers(teachers.filter(t => t.id !== user.id));
      }
      toast({ title: "Deleted User", description: "User deleted successfully." });
      setLoading(false);
    }, 600);
  };

  const openAddForm = (userType: "student" | "teacher") => {
    setCurrentUserType(userType);
    setEditUser(null);
    setOpenForm(true);
  };

  const openEditForm = (user: User) => {
    setCurrentUserType(user.role);
    setEditUser(user);
    setOpenForm(true);
  };

  return (
    <DashboardLayout title="User Management" description="View and manage all users (students, teachers, admins).">
      <QuickAdminNav />
      
      <Tabs defaultValue="students" className="space-y-6">
        <div className="flex justify-between items-center">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="students" className="text-white data-[state=active]:bg-blue-600">
              Students ({students.length})
            </TabsTrigger>
            <TabsTrigger value="teachers" className="text-white data-[state=active]:bg-blue-600">
              Teachers ({teachers.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="students">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Students</h2>
            <Button onClick={() => openAddForm("student")} variant="secondary" className="gap-2">
              <Plus size={16} /> Add Student
            </Button>
          </div>
          <UserTable
            users={students}
            loading={loading}
            onEdit={openEditForm}
            onDelete={handleDeleteUser}
            userType="student"
          />
        </TabsContent>

        <TabsContent value="teachers">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Teachers</h2>
            <Button onClick={() => openAddForm("teacher")} variant="secondary" className="gap-2">
              <Plus size={16} /> Add Teacher
            </Button>
          </div>
          <UserTable
            users={teachers}
            loading={loading}
            onEdit={openEditForm}
            onDelete={handleDeleteUser}
            userType="teacher"
          />
        </TabsContent>
      </Tabs>

      <UserForm
        open={openForm}
        onOpenChange={setOpenForm}
        user={editUser}
        onSubmit={handleAddOrEditUser}
        departments={mockDepartments}
        loading={loading}
        userType={currentUserType}
      />
    </DashboardLayout>
  );
}
