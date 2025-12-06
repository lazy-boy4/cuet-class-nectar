
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import BulkUploadForm from "@/components/admin/BulkUploadForm";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { bulkUploadStudents } from "@/api/admin";

const QuickAdminNav = () => (
  <nav className="mb-8 flex flex-wrap gap-3">
    <Link to="/admin/dashboard" className="btn-secondary">Dashboard</Link>
    <Link to="/admin/departments" className="btn-secondary">Departments</Link>
    <Link to="/admin/courses" className="btn-secondary">Courses</Link>
    <Link to="/admin/classes" className="btn-secondary">Classes</Link>
    <Link to="/admin/users" className="btn-secondary">Users</Link>
    <Link to="/admin/bulk-upload" className="btn-secondary">Bulk Upload</Link>
    <Link to="/admin/assign-teachers" className="btn-secondary">Assign Teachers</Link>
    <Link to="/admin/promote-crs" className="btn-secondary">Promote CRs</Link>
  </nav>
);

export default function BulkUpload() {
  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return bulkUploadStudents(formData);
    },
    onSuccess: (data) => {
      toast({
        title: "Students Added",
        description: `Successfully processed file. ${data.upserted_count || 'Students'} upserted.`,
      });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error || "Failed to upload students.";
      toast({ title: "Upload Error", description: msg, variant: "destructive" });
    },
  });

  const handleBulkUpload = (file: File) => {
    uploadMutation.mutate(file);
  };

  return (
    <DashboardLayout
      title="Bulk Student Upload"
      description="Upload multiple students at once using CSV files."
    >
      <QuickAdminNav />

      <div className="max-w-4xl">
        <BulkUploadForm onUpload={handleBulkUpload} loading={uploadMutation.isPending} />
      </div>
    </DashboardLayout>
  );
}
