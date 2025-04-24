
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  PlusCircle, 
  Pencil, 
  Trash2, 
  Filter, 
  Upload,
  User as UserIcon
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useToast } from "@/hooks/use-toast";
import { mockUsers } from "@/api/mockData/users";
import { mockDepartments } from "@/api/mockData/departments";

interface UserFormData {
  name: string;
  email: string;
  role: string;
  departmentId?: string;
  session?: string;
  password: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  
  // Form fields
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "student",
    departmentId: "",
    session: "",
    password: ""
  });
  
  useEffect(() => {
    document.title = "User Management - CUET Class Management System";
    
    // Check if user is authenticated as admin
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/login");
    }
  }, [navigate]);
  
  // Load users
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => mockUsers,
  });
  
  // Load departments
  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: () => mockDepartments,
  });
  
  // Filter users based on role filter, active tab, and search term
  useEffect(() => {
    let filtered = [...users];
    
    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(user => user.role === activeTab);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user => 
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          (user.departmentCode && user.departmentCode.toLowerCase().includes(term))
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, roleFilter, activeTab, searchTerm]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear department and session if role is teacher (they're only for students)
    if (name === "role" && value === "teacher") {
      setFormData(prev => ({
        ...prev,
        departmentId: "",
        session: ""
      }));
    }
  };
  
  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
    }
  };
  
  // Handle adding a new user
  const handleAddUser = () => {
    // Validation
    if (!formData.name || !formData.email || !formData.role || !formData.password) {
      toast({
        title: "Error",
        description: "Required fields are missing",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.role === "student" && (!formData.departmentId || !formData.session)) {
      toast({
        title: "Error",
        description: "Department and session are required for students",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would call an API here
    toast({
      title: "Success",
      description: "User added successfully!",
    });
    
    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      role: "student",
      departmentId: "",
      session: "",
      password: ""
    });
    setIsAddDialogOpen(false);
  };
  
  // Handle bulk upload
  const handleBulkUpload = () => {
    if (!csvFile) {
      toast({
        title: "Error",
        description: "Please select a CSV file",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would process the CSV file and send it to an API
    toast({
      title: "Success",
      description: `${csvFile.name} processed successfully. Users added.`,
    });
    
    setCsvFile(null);
    setIsBulkDialogOpen(false);
  };
  
  // Handle editing a user
  const handleEditUser = () => {
    // Validation (similar to add user)
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Error",
        description: "Required fields are missing",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.role === "student" && (!formData.departmentId || !formData.session)) {
      toast({
        title: "Error",
        description: "Department and session are required for students",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, we would call an API here
    toast({
      title: "Success",
      description: "User updated successfully!",
    });
    
    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      role: "student",
      departmentId: "",
      session: "",
      password: ""
    });
    setIsEditDialogOpen(false);
  };
  
  // Handle deleting a user
  const handleDeleteUser = () => {
    // In a real app, we would call an API here
    toast({
      title: "Success",
      description: "User deleted successfully!",
    });
    
    setIsDeleteDialogOpen(false);
  };
  
  // Open edit dialog and populate form
  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      departmentId: user.departmentId || "",
      session: user.session || "",
      password: "" // Don't populate password for security
    });
    setIsEditDialogOpen(true);
  };
  
  // Open delete dialog
  const openDeleteDialog = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };
  
  // Generate a random password
  const generateRandomPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
  };

  return (
    <DashboardLayout
      title="User Management"
      description="Manage students and teachers in the system"
    >
      {/* Tabs and Actions */}
      <div className="mb-6 flex flex-col gap-4 sm:items-center sm:justify-between">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="bg-white/5">
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="student">Students</TabsTrigger>
              <TabsTrigger value="teacher">Teachers</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-800"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
              <Button 
                onClick={() => setIsBulkDialogOpen(true)}
                variant="secondary"
                className="bg-white/10 hover:bg-white/20"
              >
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </div>
          </div>
        </Tabs>
      </div>

      {/* Search and filter bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name, email or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-white/70" />
          <Select
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="student">Students</SelectItem>
              <SelectItem value="teacher">Teachers</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="reveal rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Role</TableHead>
              <TableHead className="text-white">Department</TableHead>
              <TableHead className="text-white hidden md:table-cell">Session</TableHead>
              <TableHead className="text-white text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-white/5">
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-white/70"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="border-white/10 hover:bg-white/5"
                >
                  <TableCell className="text-white font-medium">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center mr-2">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/80">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      user.role === "admin" 
                        ? "bg-purple-700/30 text-purple-400"
                        : user.role === "teacher"
                        ? "bg-blue-700/30 text-blue-400"
                        : "bg-green-700/30 text-green-400"
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-white/80">
                    {user.departmentCode || "-"}
                  </TableCell>
                  <TableCell className="text-white/80 hidden md:table-cell">
                    {user.session || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(user)}
                      >
                        <Pencil className="h-4 w-4 text-blue-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(user)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-cuet-navy border border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-white">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full name"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role" className="text-white">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger id="role" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Show department and session fields only for students */}
            {formData.role === "student" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="department" className="text-white">
                    Department
                  </Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => handleSelectChange("departmentId", value)}
                  >
                    <SelectTrigger id="department" className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="session" className="text-white">
                    Session
                  </Label>
                  <Input
                    id="session"
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    placeholder="e.g., 2023-24"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>
              </>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white flex justify-between">
                <span>Password</span>
                <Button 
                  variant="link" 
                  type="button" 
                  onClick={generateRandomPassword} 
                  className="p-0 h-auto text-blue-400"
                >
                  Generate Random
                </Button>
              </Label>
              <Input
                id="password"
                name="password"
                type="text"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddUser}
              className="bg-gradient-to-r from-blue-600 to-blue-800"
            >
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
        <DialogContent className="bg-cuet-navy border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Bulk Upload Users</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p className="text-white/70">
              Upload a CSV file with user data. The file should have the following columns:
              name, email, role, departmentCode (for students), session (for students).
            </p>
            <div className="grid gap-2">
              <Label htmlFor="csv-file" className="text-white">
                CSV File
              </Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="bg-white/5 border-white/10 text-white file:bg-blue-600 file:text-white file:border-0"
              />
            </div>
            <a 
              href="#" 
              className="text-blue-400 text-sm hover:underline"
              onClick={(e) => {
                e.preventDefault();
                // In a real app, we would provide a download link
                toast({
                  title: "Template Downloaded",
                  description: "CSV template has been downloaded to your computer.",
                });
              }}
            >
              Download CSV template
            </a>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDialogOpen(false)}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBulkUpload}
              className="bg-gradient-to-r from-blue-600 to-blue-800"
              disabled={!csvFile}
            >
              Upload and Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-cuet-navy border border-white/10 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-white">
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full name"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email" className="text-white">
                Email
              </Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role" className="text-white">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger id="edit-role" className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Show department and session fields only for students */}
            {formData.role === "student" && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="edit-department" className="text-white">
                    Department
                  </Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={(value) => handleSelectChange("departmentId", value)}
                  >
                    <SelectTrigger id="edit-department" className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.code} - {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-session" className="text-white">
                    Session
                  </Label>
                  <Input
                    id="edit-session"
                    name="session"
                    value={formData.session}
                    onChange={handleInputChange}
                    placeholder="e.g., 2023-24"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                  />
                </div>
              </>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="edit-password" className="text-white flex justify-between">
                <span>New Password (leave blank to keep unchanged)</span>
                <Button 
                  variant="link" 
                  type="button" 
                  onClick={generateRandomPassword} 
                  className="p-0 h-auto text-blue-400"
                >
                  Generate Random
                </Button>
              </Label>
              <Input
                id="edit-password"
                name="password"
                type="text"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="New Password"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-white/5 text-white hover:bg-white/10 border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditUser}
              className="bg-gradient-to-r from-blue-600 to-blue-800"
            >
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-cuet-navy border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user{" "}
              <span className="font-medium text-white">
                {selectedUser?.name}
              </span>{" "}
              and remove all their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white hover:bg-white/10 border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
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
