
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import EnrollmentCard from "@/components/student/EnrollmentCard";
import { mockClasses } from "@/api/mockData/classes";
import { mockDepartments } from "@/api/mockData/departments";
import { mockUsers } from "@/api/mockData/users";
import { fetchEnrollments } from "@/api";

const Enroll = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sessionFilter, setSessionFilter] = useState<string>("all");

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "student") {
      navigate("/login");
      return;
    }
    
    const student = mockUsers.find(u => u.role === "student");
    if (student) {
      setCurrentUser(student);
    }
  }, [navigate]);

  const { data: enrollments = [] } = useQuery({
    queryKey: ["studentEnrollments", currentUser?.id],
    queryFn: () => fetchEnrollments(currentUser?.id),
    enabled: !!currentUser,
  });

  // Filter available classes
  const filteredClasses = mockClasses.filter(cls => {
    const matchesSearch = 
      cls.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || cls.departmentCode === departmentFilter;
    const matchesSession = sessionFilter === "all" || cls.session === sessionFilter;
    
    return matchesSearch && matchesDepartment && matchesSession;
  });

  // Get unique sessions
  const sessions = Array.from(new Set(mockClasses.map(cls => cls.session))).sort();

  const handleEnroll = (classId: string) => {
    // Mock enrollment logic
    console.log("Enrolling in class:", classId);
  };

  const getEnrollmentStatus = (classId: string) => {
    const enrollment = enrollments.find(e => e.classId === classId);
    return enrollment?.status;
  };

  const isEnrolled = (classId: string) => {
    return enrollments.some(e => e.classId === classId && e.status === "approved");
  };

  return (
    <DashboardLayout
      title="Enroll in Classes"
      description="Browse and enroll in available classes"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search by course code or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px] bg-white/5 border-white/10">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/10">
                <SelectItem value="all" className="text-white">All Departments</SelectItem>
                {mockDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.code} className="text-white">
                    {dept.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sessionFilter} onValueChange={setSessionFilter}>
              <SelectTrigger className="w-[150px] bg-white/5 border-white/10">
                <SelectValue placeholder="Session" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/10">
                <SelectItem value="all" className="text-white">All Sessions</SelectItem>
                {sessions.map((session) => (
                  <SelectItem key={session} value={session} className="text-white">
                    {session}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Available Classes</h2>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400">
              {filteredClasses.length} classes
            </Badge>
          </div>
          
          {(searchTerm || departmentFilter !== "all" || sessionFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setDepartmentFilter("all");
                setSessionFilter("all");
              }}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Classes Grid */}
        {filteredClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Filter className="h-12 w-12 text-white/30 mb-4" />
            <p className="text-lg text-white/70 mb-2">No classes found</p>
            <p className="text-sm text-white/50">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <EnrollmentCard
                key={cls.id}
                classData={cls}
                isEnrolled={isEnrolled(cls.id)}
                enrollmentStatus={getEnrollmentStatus(cls.id)}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Enroll;
