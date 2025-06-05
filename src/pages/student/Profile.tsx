
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { User, Mail, GraduationCap, Building, Camera } from "lucide-react";
import { mockUsers } from "@/api/mockData/users";

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    session: "",
    section: "",
  });

  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "student") {
      navigate("/login");
      return;
    }
    
    const student = mockUsers.find(u => u.role === "student");
    if (student) {
      setCurrentUser(student);
      setFormData({
        name: student.name,
        email: student.email,
        department: student.department || "",
        session: student.session || "",
        section: student.section || "",
      });
    }
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update current user
      setCurrentUser({ ...currentUser, ...formData });
      setIsEditing(false);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      department: currentUser?.department || "",
      session: currentUser?.session || "",
      section: currentUser?.section || "",
    });
    setIsEditing(false);
  };

  if (!currentUser) {
    return <DashboardLayout title="Profile" description=""><div>Loading...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout
      title="Student Profile"
      description="View and manage your profile information"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={currentUser.profileImage} alt={currentUser.name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-2xl">
                    {currentUser.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <CardTitle className="text-white text-xl">{currentUser.name}</CardTitle>
                <CardDescription className="text-white/70">{currentUser.email}</CardDescription>
                {currentUser.isClassRepresentative && (
                  <Badge variant="outline" className="mt-2 bg-purple-500/10 text-purple-400">
                    Class Representative
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Information */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </div>
            {!isEditing && (
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-white">Department</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session" className="text-white">Session</Label>
                    <Input
                      id="session"
                      value={formData.session}
                      onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                      placeholder="2023-24"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section" className="text-white">Section</Label>
                    <Input
                      id="section"
                      value={formData.section}
                      onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      placeholder="A, B, C..."
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                  <User className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-white/70">Full Name</p>
                    <p className="text-white">{currentUser.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                  <Mail className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-sm text-white/70">Email Address</p>
                    <p className="text-white">{currentUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                  <Building className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-white/70">Department</p>
                    <p className="text-white">{currentUser.department || "Not specified"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                    <GraduationCap className="h-5 w-5 text-orange-400" />
                    <div>
                      <p className="text-sm text-white/70">Session</p>
                      <p className="text-white">{currentUser.session || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                    <User className="h-5 w-5 text-pink-400" />
                    <div>
                      <p className="text-sm text-white/70">Section</p>
                      <p className="text-white">{currentUser.section || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
