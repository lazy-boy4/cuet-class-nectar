
import React, { useState, useMemo } from "react";
import { Search, Grid, List, Mail, MapPin, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from "@/components/DashboardLayout";
import { mockUsers } from "@/api/mockData/users";
import { Link } from "react-router-dom";

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter users based on search term and filters
  const filteredUsers = useMemo(() => {
    return mockUsers.filter(user => {
      // Search by name, email, or student ID
      const searchMatch = searchTerm === "" || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email.includes('@student.cuet.ac.bd') && 
         user.email.split('@')[0].toLowerCase().includes(searchTerm.toLowerCase()));

      const roleMatch = roleFilter === "all" || user.role === roleFilter;
      const departmentMatch = departmentFilter === "all" || user.department === departmentFilter;

      return searchMatch && roleMatch && departmentMatch;
    });
  }, [searchTerm, roleFilter, departmentFilter]);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = mockUsers
      .filter(user => user.department)
      .map(user => user.department!)
      .filter((dept, index, arr) => arr.indexOf(dept) === index);
    return depts;
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStudentId = (email: string) => {
    if (email.includes('@student.cuet.ac.bd')) {
      return email.split('@')[0];
    }
    return null;
  };

  const UserCard = ({ user }: { user: typeof mockUsers[0] }) => {
    const studentId = getStudentId(user.email);
    
    return (
      <Link to={`/profile/${user.id}`}>
        <Card className="border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer h-full">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <h3 className="text-white font-semibold">{user.name}</h3>
                  <Badge variant={user.role === "student" ? "default" : user.role === "teacher" ? "secondary" : "destructive"}>
                    {user.role === "admin" ? "Admin" : user.role === "teacher" ? "Teacher" : "Student"}
                  </Badge>
                  {user.isClassRepresentative && (
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400 text-xs">CR</Badge>
                  )}
                </div>
                
                <p className="text-white/70 text-sm">
                  Experienced educator specializing in software engineering and algorithms.
                </p>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-center space-x-2 text-white/70">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  
                  {user.department && (
                    <div className="flex items-center justify-center space-x-2 text-white/70">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{user.department}</span>
                    </div>
                  )}
                  
                  {studentId && (
                    <div className="flex items-center justify-center space-x-2 text-white/70">
                      <GraduationCap className="w-3 h-3" />
                      <span>ID: {studentId}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  <Badge variant="outline" className="text-xs">Research</Badge>
                  <Badge variant="outline" className="text-xs">Teaching</Badge>
                  <Badge variant="outline" className="text-xs">Software Architecture</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <DashboardLayout title="Global Search" description="Find and connect with students and teachers">
      <div className="space-y-8">
        {/* Search People Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center space-x-2">
              <Search className="w-6 h-6" />
              <span>Search People</span>
            </h2>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50 h-12"
            />
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/10">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="teacher">Teachers</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/10">
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Search Results ({filteredUsers.length})
            </h3>
            
            <div className="flex space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : "bg-white/5 border-white/10 hover:bg-white/10"}
              >
                Grid View
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-blue-600 hover:bg-blue-700" : "bg-white/5 border-white/10 hover:bg-white/10"}
              >
                List View
              </Button>
            </div>
          </div>
          
          {filteredUsers.length === 0 ? (
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <h3 className="text-white font-medium mb-2">No users found</h3>
                <p className="text-white/70">Try adjusting your search terms or filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GlobalSearch;
