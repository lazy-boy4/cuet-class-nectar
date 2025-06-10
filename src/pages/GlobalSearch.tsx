
import React, { useState, useEffect } from "react";
import { Search, Filter, Users, GraduationCap, Mail, Building, User, Shield, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUsers } from "@/api/mockData/users";
import { mockDepartments } from "@/api/mockData/departments";
import DashboardLayout from "@/components/DashboardLayout";
import { User as UserType } from "@/types";

interface ExtendedUser extends UserType {
  bio?: string;
  interests?: string[];
  phone?: string;
  linkedIn?: string;
  github?: string;
  website?: string;
  profileVisibility?: {
    email: boolean;
    phone: boolean;
    department: boolean;
    session: boolean;
    section: boolean;
    bio: boolean;
    interests: boolean;
    socialLinks: boolean;
  };
}

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [searchResults, setSearchResults] = useState<ExtendedUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Extended mock data with privacy settings
  const extendedUsers: ExtendedUser[] = mockUsers.map(user => ({
    ...user,
    bio: user.role === "student" ? 
      "Computer Science student passionate about web development and AI." : 
      "Experienced educator specializing in software engineering and algorithms.",
    interests: user.role === "student" ? 
      ["Web Development", "Machine Learning", "Mobile Apps"] : 
      ["Research", "Teaching", "Software Architecture"],
    phone: "+880-1234-567890",
    linkedIn: "linkedin.com/in/username",
    github: "github.com/username",
    website: "personal-website.com",
    profileVisibility: {
      email: true,
      phone: false,
      department: true,
      session: user.role === "student",
      section: user.role === "student",
      bio: true,
      interests: true,
      socialLinks: false,
    }
  }));

  useEffect(() => {
    performSearch();
  }, [searchQuery, filterRole, filterDepartment]);

  const performSearch = () => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      let results = extendedUsers.filter(user => {
        const matchesQuery = searchQuery === "" || 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.role === "student" && user.email.includes(searchQuery)); // Search by student ID extracted from email
        
        const matchesRole = filterRole === "all" || user.role === filterRole;
        const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;
        
        return matchesQuery && matchesRole && matchesDepartment;
      });
      
      setSearchResults(results);
      setIsLoading(false);
    }, 300);
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleProfileClick = (user: ExtendedUser) => {
    navigate(`/profile/${user.id}`);
  };

  const ProfileCard = ({ user }: { user: ExtendedUser }) => (
    <Card 
      className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
      onClick={() => handleProfileClick(user)}
    >
      <CardHeader>
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.profileImage} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg">
              {getUserInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-white text-lg">{user.name}</CardTitle>
              <Badge variant={user.role === "student" ? "default" : "secondary"}>
                {user.role === "student" ? <GraduationCap className="w-3 h-3 mr-1" /> : <Users className="w-3 h-3 mr-1" />}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
              {user.isClassRepresentative && (
                <Badge variant="outline" className="bg-purple-500/10 text-purple-400">
                  CR
                </Badge>
              )}
            </div>
            
            {user.profileVisibility?.bio && user.bio && (
              <CardDescription className="mt-2">{user.bio}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {user.profileVisibility?.email && (
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
        )}
        
        {user.profileVisibility?.department && user.department && (
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <Building className="w-4 h-4" />
            <span>{user.department}</span>
          </div>
        )}
        
        {user.role === "student" && (
          <div className="flex space-x-4 text-sm text-white/70">
            {user.profileVisibility?.session && user.session && (
              <div>Session: {user.session}</div>
            )}
            {user.profileVisibility?.section && user.section && (
              <div>Section: {user.section}</div>
            )}
          </div>
        )}
        
        {user.profileVisibility?.phone && user.phone && (
          <div className="flex items-center space-x-2 text-sm text-white/70">
            <span>📞 {user.phone}</span>
          </div>
        )}
        
        {user.profileVisibility?.interests && user.interests && user.interests.length > 0 && (
          <div className="space-y-1">
            <div className="text-sm text-white/70">Interests:</div>
            <div className="flex flex-wrap gap-1">
              {user.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {user.profileVisibility?.socialLinks && (
          <div className="flex space-x-2">
            {user.linkedIn && (
              <Button size="sm" variant="outline" className="text-xs">
                LinkedIn
              </Button>
            )}
            {user.github && (
              <Button size="sm" variant="outline" className="text-xs">
                GitHub
              </Button>
            )}
            {user.website && (
              <Button size="sm" variant="outline" className="text-xs">
                Website
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout
      title="Global Search"
      description="Find and connect with students and teachers"
    >
      <div className="space-y-6">
        {/* Search Controls */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search People</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search by name, email, department, or student ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-1">
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Students</SelectItem>
                    <SelectItem value="teacher">Teachers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Search Results ({searchResults.length})
            </h2>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-white/70">Searching...</div>
            </div>
          ) : searchResults.length === 0 ? (
            <Card className="border-white/10 bg-white/5">
              <CardContent className="text-center py-8">
                <Users className="w-12 h-12 text-white/50 mx-auto mb-4" />
                <div className="text-white/70">No profiles found matching your search criteria</div>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="grid" className="space-y-4">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="grid" className="text-white data-[state=active]:bg-blue-600">
                  Grid View
                </TabsTrigger>
                <TabsTrigger value="list" className="text-white data-[state=active]:bg-blue-600">
                  List View
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((user) => (
                    <ProfileCard key={user.id} user={user} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list">
                <div className="space-y-4">
                  {searchResults.map((user) => (
                    <ProfileCard key={user.id} user={user} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GlobalSearch;
