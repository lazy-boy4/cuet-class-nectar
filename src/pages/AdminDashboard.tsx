
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Grid2X2, Database, Book, Layers, Users, UserPlus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchAdminDashboardStats } from "@/api";
import { DashboardStats } from "@/types";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    document.title = "Admin Dashboard - CUET Class Management System";
    
    // Check if user is authenticated
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/login");
      return;
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Fetch admin dashboard stats
  const { data: stats } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: fetchAdminDashboardStats,
    enabled: !isLoading,
  });
  
  // Quick access links
  const quickAccessLinks = [
    {
      title: "Department Management",
      description: "Manage departments, add new departments, or update existing ones.",
      icon: Database,
      path: "/admin/departments",
      color: "bg-gradient-to-br from-purple-600 to-purple-800",
    },
    {
      title: "Course Management",
      description: "Add or edit courses, assign them to departments.",
      icon: Book,
      path: "/admin/courses",
      color: "bg-gradient-to-br from-blue-600 to-blue-800",
    },
    {
      title: "Class Management",
      description: "Create class sections, manage enrollments and schedules.",
      icon: Layers,
      path: "/admin/classes",
      color: "bg-gradient-to-br from-green-600 to-green-800",
    },
    {
      title: "User Management",
      description: "Add, edit, or remove students and teachers from the system.",
      icon: Users,
      path: "/admin/users",
      color: "bg-gradient-to-br from-orange-600 to-orange-800",
    },
    {
      title: "Assign Teachers",
      description: "Assign teachers to specific classes for the semester.",
      icon: UserPlus,
      path: "/admin/assign-teachers",
      color: "bg-gradient-to-br from-pink-600 to-pink-800",
    },
    {
      title: "Promote CRs",
      description: "Designate class representatives for each class section.",
      icon: UserPlus,
      path: "/admin/promote-crs",
      color: "bg-gradient-to-br from-yellow-600 to-yellow-800",
    },
  ];

  return (
    <DashboardLayout 
      title="Admin Dashboard"
      description="Manage the CUET Class Management System"
    >
      {/* System Statistics */}
      <section className="mb-10">
        <h2 className="mb-6 text-2xl font-semibold text-white">System Statistics</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Students" 
            value={stats?.studentsCount || 0} 
            icon={Users} 
            color="from-blue-600 to-blue-800"
          />
          <StatCard 
            title="Total Teachers" 
            value={stats?.teachersCount || 0} 
            icon={Users} 
            color="from-green-600 to-green-800"
          />
          <StatCard 
            title="Total Classes" 
            value={stats?.classesCount || 0} 
            icon={Layers} 
            color="from-purple-600 to-purple-800"
          />
          <StatCard 
            title="Total Departments" 
            value={stats?.departmentsCount || 0} 
            icon={Database} 
            color="from-orange-600 to-orange-800"
          />
        </div>
      </section>

      {/* Quick Access */}
      <section className="mb-6">
        <h2 className="mb-6 text-2xl font-semibold text-white">Quick Access</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickAccessLinks.map((link, index) => (
            <Card key={index} className="reveal border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.07]">
              <div className="p-6">
                <div className="mb-4">
                  <div className={`inline-flex rounded-lg p-3 ${link.color}`}>
                    <link.icon size={24} className="text-white" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-medium text-white">{link.title}</h3>
                <p className="mb-4 text-white/70">{link.description}</p>
                <Button 
                  onClick={() => navigate(link.path)}
                  variant="secondary"
                  className="w-full bg-white/10 hover:bg-white/20"
                >
                  Access
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AdminDashboard;
