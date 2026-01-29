
import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";
import { 
  Building2, 
  BookOpen, 
  Users, 
  GraduationCap, 
  Upload, 
  UserCog, 
  Crown,
  LayoutDashboard
} from "lucide-react";

const adminNav = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Departments", to: "/admin/departments", icon: Building2 },
  { label: "Courses", to: "/admin/courses", icon: BookOpen },
  { label: "Classes", to: "/admin/classes", icon: GraduationCap },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Bulk Upload", to: "/admin/bulk-upload", icon: Upload },
  { label: "Assign Teachers", to: "/admin/assign-teachers", icon: UserCog },
  { label: "Promote CRs", to: "/admin/promote-crs", icon: Crown },
];

const QuickAdminNav = () => (
  <nav className="mb-8 flex flex-wrap gap-3">
    {adminNav.map((item) => (
      <Link key={item.to} to={item.to}>
        <NeuButton variant="outline" size="sm" className="gap-2">
          <item.icon className="h-4 w-4" />
          {item.label}
        </NeuButton>
      </Link>
    ))}
  </nav>
);

export default function AdminDashboard() {
  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      description="Overview & shortcuts for University System Admins."
    >
      <QuickAdminNav />
      
      <NeuCard variant="raised" className="min-h-[280px]">
        <NeuCardContent className="p-8 flex flex-col items-center justify-center h-full">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-luxe-black shadow-neu-inset">
            <LayoutDashboard className="h-10 w-10 text-info" />
          </div>
          <h2 className="text-xl mb-2 font-semibold text-foreground">
            Welcome to the Admin Dashboard
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            Choose a section using the navigation above to get started managing CUET.
          </p>
        </NeuCardContent>
      </NeuCard>
    </DashboardLayout>
  );
}
