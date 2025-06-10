
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProfileVisibility {
  email: boolean;
  phone: boolean;
  department: boolean;
  session: boolean;
  section: boolean;
  bio: boolean;
  interests: boolean;
  socialLinks: boolean;
}

interface ProfilePrivacySettingsProps {
  userRole: "student" | "teacher" | "admin";
  initialSettings?: ProfileVisibility;
  onSave?: (settings: ProfileVisibility) => void;
}

const ProfilePrivacySettings: React.FC<ProfilePrivacySettingsProps> = ({
  userRole,
  initialSettings,
  onSave
}) => {
  const [settings, setSettings] = useState<ProfileVisibility>(
    initialSettings || {
      email: true,
      phone: false,
      department: true,
      session: userRole === "student",
      section: userRole === "student",
      bio: true,
      interests: true,
      socialLinks: false,
    }
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (key: keyof ProfileVisibility) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(settings);
      }
      
      toast({
        title: "Privacy Settings Updated",
        description: "Your profile visibility settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save privacy settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const PrivacyItem = ({ 
    id, 
    label, 
    description, 
    checked, 
    onToggle 
  }: {
    id: keyof ProfileVisibility;
    label: string;
    description: string;
    checked: boolean;
    onToggle: () => void;
  }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
      <div className="space-y-1">
        <Label htmlFor={id} className="text-white font-medium cursor-pointer">
          {label}
        </Label>
        <p className="text-sm text-white/70">{description}</p>
      </div>
      <div className="flex items-center space-x-2">
        {checked ? (
          <Eye className="w-4 h-4 text-green-400" />
        ) : (
          <EyeOff className="w-4 h-4 text-red-400" />
        )}
        <Switch
          id={id}
          checked={checked}
          onCheckedChange={onToggle}
        />
      </div>
    </div>
  );

  return (
    <Card className="border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Profile Privacy Settings</span>
        </CardTitle>
        <CardDescription>
          Control what information is visible to others when they search for your profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PrivacyItem
          id="email"
          label="Email Address"
          description="Show your email address in search results"
          checked={settings.email}
          onToggle={() => handleToggle("email")}
        />

        <PrivacyItem
          id="phone"
          label="Phone Number"
          description="Display your phone number to other users"
          checked={settings.phone}
          onToggle={() => handleToggle("phone")}
        />

        <PrivacyItem
          id="department"
          label="Department"
          description="Show which department you belong to"
          checked={settings.department}
          onToggle={() => handleToggle("department")}
        />

        {userRole === "student" && (
          <>
            <PrivacyItem
              id="session"
              label="Session"
              description="Display your academic session year"
              checked={settings.session}
              onToggle={() => handleToggle("session")}
            />

            <PrivacyItem
              id="section"
              label="Section"
              description="Show your class section"
              checked={settings.section}
              onToggle={() => handleToggle("section")}
            />
          </>
        )}

        <PrivacyItem
          id="bio"
          label="Bio/Description"
          description="Share your personal bio or description"
          checked={settings.bio}
          onToggle={() => handleToggle("bio")}
        />

        <PrivacyItem
          id="interests"
          label="Interests & Skills"
          description="Display your interests and skills"
          checked={settings.interests}
          onToggle={() => handleToggle("interests")}
        />

        <PrivacyItem
          id="socialLinks"
          label="Social Media Links"
          description="Show links to your social media profiles"
          checked={settings.socialLinks}
          onToggle={() => handleToggle("socialLinks")}
        />

        <div className="pt-4 border-t border-white/10">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? "Saving..." : "Save Privacy Settings"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePrivacySettings;
