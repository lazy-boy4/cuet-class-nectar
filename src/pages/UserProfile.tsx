
import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, GraduationCap, Calendar, Users, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/DashboardLayout";
import { mockUsers } from "@/api/mockData/users";

const UserProfile = () => {
  const { userId } = useParams();
  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <DashboardLayout title="Profile Not Found" description="The requested user profile could not be found">
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-8 text-center">
            <h3 className="text-white font-medium mb-2">User Not Found</h3>
            <p className="text-white/70 mb-4">The profile you're looking for doesn't exist.</p>
            <Link to="/search">
              <Button variant="outline" className="bg-white/5 border-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Search
              </Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStudentId = (email: string) => {
    if (email.includes('@student.cuet.ac.bd')) {
      return email.split('@')[0];
    }
    return null;
  };

  const studentId = getStudentId(user.email);

  return (
    <DashboardLayout title={`${user.name}'s Profile`} description="View user profile information">
      <div className="space-y-6">
        {/* Back Button */}
        <Link to="/search">
          <Button variant="outline" className="bg-white/5 border-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        {/* Profile Header */}
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profileImage} alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                  <Badge variant={
                    user.role === "student" ? "default" : 
                    user.role === "teacher" ? "secondary" : 
                    "destructive"
                  }>
                    {user.role}
                  </Badge>
                  {user.isClassRepresentative && (
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      Class Representative
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-white/70">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  {studentId && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <GraduationCap className="w-4 h-4" />
                      <span>Student ID: {studentId}</span>
                    </div>
                  )}
                  
                  {user.department && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  
                  {user.session && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span>Session: {user.session}</span>
                    </div>
                  )}
                  
                  {user.section && (
                    <div className="flex items-center space-x-2 text-white/70">
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
          {user.role === "student" && (
            <Card className="border-white/10 bg-white/5">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>Academic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-white/70">Department</label>
                  <p className="text-white font-medium">{user.department || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm text-white/70">Session</label>
                  <p className="text-white font-medium">{user.session || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm text-white/70">Section</label>
                  <p className="text-white font-medium">{user.section || "Not specified"}</p>
                </div>
                {user.isClassRepresentative && (
                  <div className="mt-4">
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      <Award className="w-3 h-3 mr-1" />
                      Class Representative
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                <label className="text-sm text-white/70">Email Address</label>
                <p className="text-white font-medium">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-white/70">Phone Number</label>
                <p className="text-white/70">Not available in public profile</p>
              </div>
            </CardContent>
          </Card>

          {/* Bio Section */}
          <Card className="border-white/10 bg-white/5 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                This user hasn't added a bio yet. Bio information would be displayed here 
                based on their privacy settings.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
