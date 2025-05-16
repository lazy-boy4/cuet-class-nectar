
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
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

export default function DepartmentManagement() {
  return (
    <DashboardLayout title="Department Management" description="Manage university departments here.">
      <QuickAdminNav />
      <section className="bg-white/5 rounded-lg p-8 min-h-[280px] flex flex-col items-center justify-center">
        <h2 className="text-xl mb-2 font-semibold text-white">Department Management Coming Soon</h2>
        <p className="text-gray-300">This page will allow admins to add, edit, and manage university departments.</p>
      </section>
    </DashboardLayout>
  );
}
