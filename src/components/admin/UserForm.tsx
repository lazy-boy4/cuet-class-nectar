
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Department } from "@/types";

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: (data: Omit<User, "id">) => void;
  departments: Department[];
  loading: boolean;
  userType: "student" | "teacher";
}

const UserForm = ({ 
  open, 
  onOpenChange, 
  user, 
  onSubmit, 
  departments, 
  loading,
  userType 
}: UserFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: userType as "student" | "teacher",
    department: "",
    session: "",
    section: "",
    profileImage: "",
    isClassRepresentative: false,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || "",
        session: user.session || "",
        section: user.section || "",
        profileImage: user.profileImage || "",
        isClassRepresentative: user.isClassRepresentative || false,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: userType,
        department: "",
        session: "",
        section: "",
        profileImage: "",
        isClassRepresentative: false,
      });
    }
  }, [user, open, userType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>
            {user ? `Edit ${userType}` : `Add New ${userType}`}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={`${userType}@cuet.ac.bd`}
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })}
            >
              <SelectTrigger className="bg-white/5 border-white/10">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/10">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.code} className="text-white">
                    {dept.code} - {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {userType === "student" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session">Session</Label>
                  <Input
                    id="session"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    placeholder="2023-24"
                    className="bg-white/5 border-white/10"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    placeholder="A, B, C..."
                    className="bg-white/5 border-white/10"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Saving..." : user ? `Update ${userType}` : `Add ${userType}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
