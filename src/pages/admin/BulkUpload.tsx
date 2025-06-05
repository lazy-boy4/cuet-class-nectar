
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import BulkUploadForm from "@/components/admin/BulkUploadForm";
import { toast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(false);

  const handleBulkUpload = async (data: any[]) => {
    setLoading(true);
    
    try {
      // Simulate API call to create students
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Uploading students:", data);
      
      toast({
        title: "Students Added",
        description: `Successfully added ${data.length} students to the system.`,
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to add students to the system.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout 
      title="Bulk Student Upload" 
      description="Upload multiple students at once using CSV files."
    >
      <QuickAdminNav />
      
      <div className="max-w-4xl">
        <BulkUploadForm onUpload={handleBulkUpload} loading={loading} />
      </div>
    </DashboardLayout>
  );
}
