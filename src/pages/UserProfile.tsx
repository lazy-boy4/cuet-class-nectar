
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Building, Calendar, Users, Award, MapPin, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockUsers } from "@/api/mockData/users";
import DashboardLayout from "@/components/DashboardLayout";

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return (
      <DashboardLayout title="Profile Not Found" description="User profile not found">
        <div className="text-center py-8">
          <div className="text-white/70">User profile not found</div>
          <Button 
            variant="outline" 
            onClick={() => navigate("/search")}
            className="mt-4"
          >
            Back to Search
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStudentId = (email: string) => {
    if (user.role === "student") {
      const match = email.match(/u(\d+)@/);
      return match ? match[1] : null;
    }
    return null;
  };

  return (
    <DashboardLayout
      title={`${user.name}'s Profile`}
      description="View user profile information"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate("/search")}
          className="flex items-center space-x-2 bg-white/5 border-white/10 text-white hover:bg-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Button>

        {/* Profile Header */}
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-2xl">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                    <Badge variant={user.role === "student" ? "default" : "secondary"}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    {user.isClassRepresentative && (
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Class Representative
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  {user.role === "student" && getStudentId(user.email) && (
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Student ID: {getStudentId(user.email)}</span>
                    </div>
                  )}
                  
                  {user.department && (
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  
                  {user.role === "student" && user.section && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Section: {user.section}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Academic Information */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>Academic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-white/70 mb-1">Department</div>
                <div className="text-white">{user.department || "Not specified"}</div>
              </div>
              
              {user.role === "student" && (
                <>
                  <div>
                    <div className="text-sm text-white/70 mb-1">Session</div>
                    <div className="text-white">{user.session || "Not specified"}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-white/70 mb-1">Section</div>
                    <div className="text-white">{user.section || "Not specified"}</div>
                  </div>
                  
                  {user.isClassRepresentative && (
                    <div className="flex items-center space-x-2 pt-2">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Class Representative
                      </Badge>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-white/70 mb-1">Email Address</div>
                <div className="text-white">{user.email}</div>
              </div>
              
              <div>
                <div className="text-sm text-white/70 mb-1">Phone Number</div>
                <div className="text-white/70">Not available in public profile</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
