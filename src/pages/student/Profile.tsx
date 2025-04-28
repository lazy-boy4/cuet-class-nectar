
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Camera, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { fetchStudentProfile } from "@/api/student";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    session: "",
    section: "",
    profileImage: "",
  });
  
  useEffect(() => {
    document.title = "Student Profile - CUET Class Management System";
    
    // Check if user is authenticated
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId") || "student-1"; // Default for demo
    
    if (!userRole || userRole !== "student") {
      navigate("/login");
      return;
    }
    
    setUserId(userId);
  }, [navigate]);
  
  // Fetch student profile data
  const { data: studentProfile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["studentProfile", userId],
    queryFn: () => fetchStudentProfile(userId as string),
    enabled: !!userId,
  });
  
  // Update form data when profile is loaded
  useEffect(() => {
    if (studentProfile) {
      setFormData({
        name: studentProfile.name,
        email: studentProfile.email,
        department: studentProfile.department || "",
        session: studentProfile.session || "",
        section: studentProfile.section || "",
        profileImage: studentProfile.profileImage || "",
      });
    }
  }, [studentProfile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to update the profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (isProfileLoading) {
    return (
      <DashboardLayout
        title="Your Profile"
        description="View and manage your personal information"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
          <span className="ml-2 text-white/70">Loading profile...</span>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout
      title="Your Profile"
      description="View and manage your personal information"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left column - Profile picture */}
        <div className="col-span-1">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="relative mb-4">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-800 text-white">
                    <User size={64} />
                  </div>
                )}
                
                {isEditing && (
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full"
                    disabled={loading}
                  >
                    <Camera size={16} />
                  </Button>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-white">{formData.name}</h3>
              <p className="text-sm text-white/70">{formData.email}</p>
              
              {studentProfile?.isClassRepresentative && (
                <div className="mt-2 rounded-full bg-blue-700/30 px-3 py-1 text-xs font-medium text-blue-400">
                  Class Representative
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Profile details */}
        <div className="col-span-1 md:col-span-2">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">Personal Information</CardTitle>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data to original values if profile exists
                    if (studentProfile) {
                      setFormData({
                        name: studentProfile.name,
                        email: studentProfile.email,
                        department: studentProfile.department || "",
                        session: studentProfile.session || "",
                        section: studentProfile.section || "",
                        profileImage: studentProfile.profileImage || "",
                      });
                    }
                  }}
                >
                  Cancel
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing || loading}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled={true} // Email cannot be changed
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                
                <Separator className="my-4 bg-white/10" />
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      disabled={true} // Department cannot be changed by student
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session">Session</Label>
                    <Input
                      id="session"
                      name="session"
                      value={formData.session}
                      disabled={true} // Session cannot be changed by student
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Input
                      id="section"
                      name="section"
                      value={formData.section}
                      disabled={true} // Section cannot be changed by student
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-600 to-blue-800" 
                      disabled={loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
