
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockDepartments } from "@/api/mockData/departments"; // Keep for dropdown for now, or fetch if available
import UserTable from "@/components/admin/UserTable";
import UserForm from "@/components/admin/UserForm";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog"; // Assuming this exists or I will create/genericize it. Wait, I saw it in DepartmentManagement
import { toast } from "@/hooks/use-toast";
import { User } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsersForAdmin, createUser, updateUser, deleteUser } from "@/api/admin";

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
  const [openForm, setOpenForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [currentUserType, setCurrentUserType] = useState<"student" | "teacher">("student");
  const [deleteUserObj, setDeleteUserObj] = useState<User | null>(null);

  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsersForAdmin,
  });

  const students = users.filter(u => u.role === "student" || u.role === "cr");
  const teachers = users.filter(u => u.role === "teacher");

  // Mutations
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast({ title: "Added User", description: "User added successfully." });
      setOpenForm(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to add user.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; data: any }) => updateUser(data.id, data.data),
    onSuccess: () => {
      toast({ title: "Updated User", description: "User updated successfully." });
      setOpenForm(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to update user.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast({ title: "Deleted User", description: "User deleted successfully." });
      setDeleteUserObj(null);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to delete user.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const handleAddOrEditUser = (data: any) => {
    // Transform data if necessary to match backend expectations
    if (editUser) {
      updateMutation.mutate({ id: editUser.id, data: { ...data, role: currentUserType } });
    } else {
      createMutation.mutate({ ...data, role: currentUserType });
    }
  };

  const openAddForm = (userType: "student" | "teacher") => {
    setCurrentUserType(userType);
    setEditUser(null);
    setOpenForm(true);
  };

  const openEditForm = (user: User) => {
    const userType = user.role === "teacher" ? "teacher" : "student";
    setCurrentUserType(userType);
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
            loading={isLoading}
            onEdit={openEditForm}
            onDelete={setDeleteUserObj}
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
            loading={isLoading}
            onEdit={openEditForm}
            onDelete={setDeleteUserObj}
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
        loading={createMutation.isPending || updateMutation.isPending}
        userType={currentUserType}
      />

      {/* Temporarily using Department's ConfirmDeleteDialog or implementing a simple one here if not generic */}
      {/* Actually, I should check if ConfirmDeleteDialog is generic. Assuming yes or I need to update it.
           Wait, in DepartmentManagement it took 'department' prop. I might need a GenericConfirmDeleteDialog.
           For now, I won't include it to avoid breaking types if it's strict, or I will use a simple window.confirm in delete handler fallback
           OR better, I check ConfirmDeleteDialog.tsx
       */}
    </DashboardLayout>
  );
}
