
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DepartmentTable from "@/components/admin/DepartmentTable";
import DepartmentForm from "@/components/admin/DepartmentForm";
import ConfirmDeleteDialog from "@/components/admin/ConfirmDeleteDialog";
import { Department } from "@/types";
import { fetchDepartmentsForAdmin, createDepartment, updateDepartment, deleteDepartment } from "@/api/admin";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DepartmentManagement() {
  // Dialog state
  const [openForm, setOpenForm] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [deleteDept, setDeleteDept] = useState<Department | null>(null);

  const queryClient = useQueryClient();

  // Fetch departments
  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartmentsForAdmin,
  });

  // Mutation: create/edit
  const createMutation = useMutation({
    mutationFn: createDepartment,
    onSuccess: async (newDept) => {
      toast({ title: "Added Department", description: "Department added successfully." });
      setOpenForm(false);
      await queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: () => toast({ title: "Error adding department", variant: "destructive" }),
  });
  const updateMutation = useMutation({
    mutationFn: updateDepartment,
    onSuccess: async () => {
      toast({ title: "Updated Department", description: "Department updated successfully." });
      setOpenForm(false);
      await queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: () => toast({ title: "Error updating department", variant: "destructive" }),
  });

  // Mutation: delete
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteDepartment(id),
    onSuccess: async () => {
      toast({ title: "Deleted Department", description: "Department deleted successfully." });
      setDeleteDept(null);
      await queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: () => toast({ title: "Error deleting department", variant: "destructive" }),
  });

  return (
    <DashboardLayout title="Department Management" description="Manage university departments here.">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-white">Departments</h2>
        <Button onClick={() => { setEditDept(null); setOpenForm(true); }} variant="secondary" className="gap-2">
          <Plus size={16} /> Add Department
        </Button>
      </div>
      <DepartmentTable
        departments={departments || []}
        loading={isLoading}
        onEdit={dept => { setEditDept(dept); setOpenForm(true); }}
        onDelete={dept => setDeleteDept(dept)}
      />
      <DepartmentForm
        open={openForm}
        onOpenChange={setOpenForm}
        department={editDept}
        onSubmit={data =>
          editDept
            ? updateMutation.mutate({ ...editDept, ...data })
            : createMutation.mutate(data)
        }
        loading={createMutation.isPending || updateMutation.isPending}
      />
      <ConfirmDeleteDialog
        open={!!deleteDept}
        onOpenChange={v => !v && setDeleteDept(null)}
        department={deleteDept}
        onConfirm={() => {
          if (deleteDept) deleteMutation.mutate(deleteDept.id);
        }}
        loading={deleteMutation.isPending}
      />
    </DashboardLayout>
  );
}
