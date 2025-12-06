import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import ProfilePrivacySettings from "@/components/ProfilePrivacySettings";
import { User, Mail, GraduationCap, Building, Camera, Settings, Shield, IdCard } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  dept_code: string;
  role: string;
  student_id?: string;
  batch?: string;
  section?: string;
  picture_url?: string;
  created_at?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    batch: "",
    section: "",
    bio: "",
    interests: "",
    phone: "",
    linkedIn: "",
    github: "",
    website: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
      const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

      if (!accessToken || !userRole) {
        navigate("/login");
        return;
      }

      if (userRole !== "student" && userRole !== "cr") {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired, redirect to login
            localStorage.clear();
            sessionStorage.clear();
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const data: UserProfile = await response.json();
        setCurrentUser(data);

        // Update localStorage with latest data
        const storage = localStorage.getItem("access_token") ? localStorage : sessionStorage;
        storage.setItem("userProfile", JSON.stringify({
          name: data.full_name,
          picture: data.picture_url || "",
        }));
        storage.setItem("userRole", data.role);

        setFormData({
          name: data.full_name || "",
          email: data.email || "",
          department: data.dept_code || "",
          batch: data.batch || "",
          section: data.section || "",
          bio: "",
          interests: "",
          phone: "",
          linkedIn: "",
          github: "",
          website: "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const accessToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.name,
          section: formData.section,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedData = await response.json();
      setCurrentUser(updatedData);
      setIsEditing(false);

      // Update localStorage
      const storage = localStorage.getItem("access_token") ? localStorage : sessionStorage;
      storage.setItem("userProfile", JSON.stringify({
        name: updatedData.full_name,
        picture: updatedData.picture_url || "",
      }));

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
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (currentUser) {
      setFormData({
        name: currentUser.full_name || "",
        email: currentUser.email || "",
        department: currentUser.dept_code || "",
        batch: currentUser.batch || "",
        section: currentUser.section || "",
        bio: "",
        interests: "",
        phone: "",
        linkedIn: "",
        github: "",
        website: "",
      });
    }
    setIsEditing(false);
  };

  const getDepartmentName = (code: string): string => {
    const departments: { [key: string]: string } = {
      "01": "Civil Engineering",
      "02": "Electrical and Electronic Engineering",
      "03": "Mechanical Engineering",
      "04": "Computer Science and Engineering",
      "05": "Urban & Regional Planning",
      "06": "Architecture",
      "07": "Petroleum and Mining Engineering",
      "08": "Electronics and Telecommunication Engineering",
      "09": "Mechatronics and Industrial Engineering",
      "10": "Water Resources Engineering",
      "11": "Biomedical Engineering",
      "12": "Materials and Metallurgical Engineering",
    };
    return departments[code] || code;
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Profile" description="">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading profile...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!currentUser) {
    return (
      <DashboardLayout title="Profile" description="">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Failed to load profile</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Student Profile"
      description="View and manage your profile information"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="border-white/10 bg-white/5">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={currentUser.picture_url} alt={currentUser.full_name} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-2xl">
                    {currentUser.full_name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
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
                <CardTitle className="text-white text-xl">{currentUser.full_name}</CardTitle>
                <CardDescription className="text-white/70">{currentUser.email}</CardDescription>
                {currentUser.role === "cr" && (
                  <Badge variant="outline" className="mt-2 bg-purple-500/10 text-purple-400">
                    Class Representative
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-blue-600">
              <User className="w-4 h-4 mr-2" />
              Profile Information
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-white data-[state=active]:bg-blue-600">
              <Shield className="w-4 h-4 mr-2" />
              Privacy Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-white/10 bg-white/5">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription>Manage your personal information and details</CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          className="bg-white/5 border-white/10 text-white"
                          disabled
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="batch" className="text-white">Batch</Label>
                        <Input
                          id="batch"
                          value={formData.batch}
                          className="bg-white/5 border-white/10 text-white"
                          disabled
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
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                      <User className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-white/70">Full Name</p>
                        <p className="text-white">{currentUser.full_name}</p>
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
                      <IdCard className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-sm text-white/70">Student ID</p>
                        <p className="text-white">{currentUser.student_id || "Not specified"}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                      <Building className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-white/70">Department</p>
                        <p className="text-white">{getDepartmentName(currentUser.dept_code)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/5">
                        <GraduationCap className="h-5 w-5 text-orange-400" />
                        <div>
                          <p className="text-sm text-white/70">Batch</p>
                          <p className="text-white">{currentUser.batch || "Not specified"}</p>
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
          </TabsContent>

          <TabsContent value="privacy">
            <ProfilePrivacySettings
              userRole="student"
              onSave={(settings) => {
                toast({
                  title: "Privacy Settings Saved",
                  description: "Your profile visibility settings have been updated.",
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
