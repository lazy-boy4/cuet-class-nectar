
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, PlusCircle, Search, Upload, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { mockUsers } from "@/api/mockData/users";
import { mockDepartments } from "@/api/mockData/departments";
import { User } from "@/types";

const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);

  // Form data for new user
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    department: "",
    session: "",
    section: "",
    password: "",
  });

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoleFilter = roleFilter ? user.role === roleFilter : true;
    
    return matchesSearchTerm && matchesRoleFilter;
  });

  // Handle input change for new user form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select change for dropdown fields
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle submit for new user form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Generate a random ID
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role as "admin" | "teacher" | "student",
      department: formData.department,
      ...(formData.role === "student" && {
        session: formData.session,
        section: formData.section,
      }),
    };
    
    // Update users state
    setUsers([...users, newUser]);
    
    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      role: "student",
      department: "",
      session: "",
      section: "",
      password: "",
    });
    
    setIsAddUserOpen(false);
    
    toast({
      title: "Success",
      description: `User ${newUser.name} has been added.`,
    });
  };

  // Handle delete user
  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    // Filter out the user to delete
    const updatedUsers = users.filter((user) => user.id !== userToDelete.id);
    setUsers(updatedUsers);
    
    // Close dialog and reset userToDelete
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
    
    toast({
      title: "Success",
      description: `User ${userToDelete.name} has been deleted.`,
    });
  };

  // Handle file change for bulk upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBulkUploadFile(e.target.files[0]);
    }
  };

  // Handle bulk upload submit
  const handleBulkUploadSubmit = () => {
    if (!bulkUploadFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    // Mock successful upload
    setIsBulkUploadOpen(false);
    setBulkUploadFile(null);
    
    toast({
      title: "Success",
      description: "Users have been successfully uploaded.",
    });
  };

  return (
    <DashboardLayout
      title="User Management"
      description="Manage students and teachers in the system"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm border-white/10"
          />
          <Select onValueChange={(value) => setRoleFilter(value || null)}>
            <SelectTrigger className="w-[140px] border-white/10">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="teacher">Teachers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setIsBulkUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Bulk Upload
          </Button>
          <Button onClick={() => setIsAddUserOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] text-white/70">Name</TableHead>
              <TableHead className="text-white/70">Email</TableHead>
              <TableHead className="text-white/70">Role</TableHead>
              <TableHead className="text-white/70">Department</TableHead>
              <TableHead className="text-right text-white/70">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-white">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-white/70">{user.email}</TableCell>
                  <TableCell className="text-white/70">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-600/30 text-purple-400"
                          : user.role === "teacher"
                          ? "bg-blue-600/30 text-blue-400"
                          : "bg-green-600/30 text-green-400"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/70">
                    {user.department}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:bg-red-900/20 hover:text-red-400"
                      onClick={() => {
                        setUserToDelete(user);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <p className="text-white/70">No users found.</p>
                  <p className="text-sm text-white/50">
                    Try adjusting your search or filter.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter name"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <Select
                value={formData.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.role === "student" && (
              <>
                <div className="space-y-2">
                  <label htmlFor="session" className="text-sm font-medium">
                    Session
                  </label>
                  <Input
                    id="session"
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    placeholder="e.g. 2023-24"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="section" className="text-sm font-medium">
                    Section
                  </label>
                  <Input
                    id="section"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    placeholder="e.g. A"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password or leave empty to auto-generate"
              />
            </div>

            <DialogFooter>
              <Button type="submit">Add User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Upload Users</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upload CSV File
              </label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
              />
              <p className="text-xs text-muted-foreground">
                CSV should include columns: Name, Email, Role, Department, Session (for students), Section (for students)
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Template
              </label>
              <div className="flex items-center rounded-md bg-secondary p-3">
                <span className="text-xs text-secondary-foreground">
                  Download our <a href="#" className="underline">CSV template</a> to get started.
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleBulkUploadSubmit}>
                Upload and Process
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {userToDelete?.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default UserManagement;
