
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Camera, Upload, User, Mail, Key, School, Users, BookOpen, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const departments = [
  "01 - Civil Engineering",
  "02 - Electrical and Electronic Engineering",
  "03 - Mechanical Engineering",
  "04 - Computer Science and Engineering",
  "05 - Urban & Regional Planning",
  "06 - Architecture",
  "07 - Petroleum and Mining Engineering",
  "08 - Electronics and Telecommunication Engineering",
  "09 - Mechatronics and Industrial Engineering",
  "10 - Water Resources Engineering",
  "11 - Biomedical Engineering",
  "12 - Materials and Metallurgical Engineering",
];

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("student");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Student form state
  const [studentForm, setStudentForm] = useState({
    cuetId: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    batch: "",
    section: "",
  });

  // Teacher form state
  const [teacherForm, setTeacherForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  // Set the page title
  useEffect(() => {
    document.title = "Sign Up - CUET Class Management System";
  }, []);

  // Handle profile image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate student form
  const validateStudentForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate CUET ID (7 digits, starting with batch year)
    if (!/^\d{7}$/.test(studentForm.cuetId)) {
      newErrors.cuetId = "CUET ID must be 7 digits";
    }
    
    // Validate name
    if (studentForm.fullName.trim().length < 3) {
      newErrors.fullName = "Full name is required";
    }
    
    // Validate email
    const expectedEmail = `u${studentForm.cuetId}@student.cuet.ac.bd`;
    if (studentForm.email !== expectedEmail) {
      newErrors.email = `Email must be ${expectedEmail}`;
    }
    
    // Validate password
    if (studentForm.password.length < 8 || !/[a-zA-Z]/.test(studentForm.password) || !/\d/.test(studentForm.password)) {
      newErrors.password = "Password must be at least 8 characters with letters and numbers";
    }
    
    // Validate password confirmation
    if (studentForm.password !== studentForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Validate department
    if (!studentForm.department) {
      newErrors.department = "Department is required";
    }
    
    // Validate batch
    if (!studentForm.batch) {
      newErrors.batch = "Batch is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate teacher form
  const validateTeacherForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (teacherForm.fullName.trim().length < 3) {
      newErrors.teacherFullName = "Full name is required";
    }
    
    // Validate email
    if (!teacherForm.email.endsWith("@cuet.ac.bd")) {
      newErrors.teacherEmail = "Email must end with @cuet.ac.bd";
    }
    
    // Validate password
    if (teacherForm.password.length < 8 || !/[a-zA-Z]/.test(teacherForm.password) || !/\d/.test(teacherForm.password)) {
      newErrors.teacherPassword = "Password must be at least 8 characters with letters and numbers";
    }
    
    // Validate password confirmation
    if (teacherForm.password !== teacherForm.confirmPassword) {
      newErrors.teacherConfirmPassword = "Passwords do not match";
    }
    
    // Validate department
    if (!teacherForm.department) {
      newErrors.teacherDepartment = "Department is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle student form change
  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Auto-populate the email when CUET ID changes
    if (name === "cuetId") {
      setStudentForm({
        ...studentForm,
        cuetId: value,
        email: `u${value}@student.cuet.ac.bd`,
      });
    } else {
      setStudentForm({
        ...studentForm,
        [name]: value,
      });
    }
  };

  // Handle teacher form change
  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTeacherForm({
      ...teacherForm,
      [name]: value,
    });
  };

  // Handle student signup
  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStudentForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: studentForm.email,
        password: studentForm.password,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // 2. Upload profile image if exists
        let profileImageUrl = null;
        if (profileImage) {
          const fileName = `${authData.user.id}_${Date.now()}.${profileImage.name.split('.').pop()}`;
          const { data: storageData, error: storageError } = await supabase.storage
            .from('profile-images')
            .upload(fileName, profileImage);
            
          if (storageError) {
            console.error("Error uploading image:", storageError);
          } else {
            profileImageUrl = `${supabaseUrl}/storage/v1/object/public/profile-images/${fileName}`;
          }
        }
        
        // 3. Insert user data into students table
        const { error: profileError } = await supabase
          .from('students')
          .insert([
            {
              user_id: authData.user.id,
              cuet_id: studentForm.cuetId,
              full_name: studentForm.fullName,
              email: studentForm.email,
              department: studentForm.department,
              batch: studentForm.batch,
              section: studentForm.section || null,
              profile_image_url: profileImageUrl,
            },
          ]);
          
        if (profileError) throw profileError;
        
        toast({
          title: "Signup successful!",
          description: "Please log in with your credentials.",
          duration: 5000,
        });
        
        // Redirect to login page
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle teacher signup
  const handleTeacherSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateTeacherForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: teacherForm.email,
        password: teacherForm.password,
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // 2. Upload profile image if exists
        let profileImageUrl = null;
        if (profileImage) {
          const fileName = `${authData.user.id}_${Date.now()}.${profileImage.name.split('.').pop()}`;
          const { data: storageData, error: storageError } = await supabase.storage
            .from('profile-images')
            .upload(fileName, profileImage);
            
          if (storageError) {
            console.error("Error uploading image:", storageError);
          } else {
            profileImageUrl = `${supabaseUrl}/storage/v1/object/public/profile-images/${fileName}`;
          }
        }
        
        // 3. Insert user data into teachers table
        const { error: profileError } = await supabase
          .from('teachers')
          .insert([
            {
              user_id: authData.user.id,
              full_name: teacherForm.fullName,
              email: teacherForm.email,
              department: teacherForm.department,
              profile_image_url: profileImageUrl,
            },
          ]);
          
        if (profileError) throw profileError;
        
        toast({
          title: "Signup successful!",
          description: "Please log in with your credentials.",
          duration: 5000,
        });
        
        // Redirect to login page
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-cuet-navy">
        <div className="container mx-auto px-4 py-12">
          <div className="reveal mx-auto max-w-md md:max-w-xl lg:max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white md:text-4xl">Create an Account</h1>
              <p className="mt-2 text-white/70">
                Your gateway to CUET's academic system
              </p>
            </div>
            
            <div className="glass-card overflow-hidden p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="student" className="text-sm">Student</TabsTrigger>
                  <TabsTrigger value="teacher" className="text-sm">Teacher</TabsTrigger>
                </TabsList>
                
                <TabsContent value="student">
                  <form onSubmit={handleStudentSignup} className="space-y-4">
                    {/* Profile Image Upload */}
                    <div className="mb-6 flex flex-col items-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-secondary">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile Preview" 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User className="h-12 w-12 text-white/50" />
                          </div>
                        )}
                        <label 
                          htmlFor="student-profile-image" 
                          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-cuet-blue text-white"
                        >
                          <Camera size={14} />
                        </label>
                        <input 
                          type="file" 
                          id="student-profile-image" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange} 
                        />
                      </div>
                      <p className="mt-2 text-xs text-white/60">Upload profile picture</p>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* CUET ID */}
                      <div className="col-span-1">
                        <label htmlFor="cuetId" className="mb-1 block text-sm text-white/90">
                          CUET ID
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                            <School size={16} />
                          </span>
                          <input
                            id="cuetId"
                            name="cuetId"
                            type="text"
                            placeholder="2309026"
                            value={studentForm.cuetId}
                            onChange={handleStudentChange}
                            className={`w-full rounded-md border ${errors.cuetId ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                          />
                        </div>
                        {errors.cuetId && (
                          <p className="mt-1 flex items-center text-xs text-red-400">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.cuetId}
                          </p>
                        )}
                      </div>

                      {/* Full Name */}
                      <div className="col-span-1">
                        <label htmlFor="fullName" className="mb-1 block text-sm text-white/90">
                          Full Name
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                            <User size={16} />
                          </span>
                          <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={studentForm.fullName}
                            onChange={handleStudentChange}
                            className={`w-full rounded-md border ${errors.fullName ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                          />
                        </div>
                        {errors.fullName && (
                          <p className="mt-1 flex items-center text-xs text-red-400">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.fullName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="mb-1 block text-sm text-white/90">
                        Official CUET Email
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                          <Mail size={16} />
                        </span>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="u2309026@student.cuet.ac.bd"
                          value={studentForm.email}
                          readOnly
                          className={`w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 flex items-center text-xs text-red-400">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.email}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-white/60">
                        Auto-generated based on your CUET ID
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Password */}
                      <div className="col-span-1">
                        <label htmlFor="password" className="mb-1 block text-sm text-white/90">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                            <Key size={16} />
                          </span>
                          <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={studentForm.password}
                            onChange={handleStudentChange}
                            className={`w-full rounded-md border ${errors.password ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                          />
                        </div>
                        {errors.password && (
                          <p className="mt-1 flex items-center text-xs text-red-400">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="col-span-1">
                        <label htmlFor="confirmPassword" className="mb-1 block text-sm text-white/90">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                            <Key size={16} />
                          </span>
                          <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={studentForm.confirmPassword}
                            onChange={handleStudentChange}
                            className={`w-full rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="mt-1 flex items-center text-xs text-red-400">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Department */}
                      <div className="col-span-1">
                        <label htmlFor="department" className="mb-1 block text-sm text-white/90">
                          Department
                        </label>
                        <select
                          id="department"
                          name="department"
                          value={studentForm.department}
                          onChange={handleStudentChange}
                          className={`w-full rounded-md border ${errors.department ? 'border-red-500' : 'border-white/10'} bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                        >
                          <option value="" disabled>
                            Select Department
                          </option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                        {errors.department && (
                          <p className="mt-1 flex items-center text-xs text-red-400">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.department}
                          </p>
                        )}
                      </div>

                      {/* Batch */}
                      <div className="col-span-1">
                        <label htmlFor="batch" className="mb-1 block text-sm text-white/90">
                          Batch
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                            <Users size={16} />
                          </span>
                          <input
                            id="batch"
                            name="batch"
                            type="text"
                            placeholder="2023-2024"
                            value={studentForm.batch}
                            onChange={handleStudentChange}
                            className={`w-full rounded-md border ${errors.batch ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                          />
                        </div>
                        {errors.batch && (
                          <p className="mt-1 flex items-center text-xs text-red-400">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.batch}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Section (Optional) */}
                    <div>
                      <label htmlFor="section" className="mb-1 block text-sm text-white/90">
                        Section (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                          <BookOpen size={16} />
                        </span>
                        <input
                          id="section"
                          name="section"
                          type="text"
                          placeholder="A"
                          value={studentForm.section}
                          onChange={handleStudentChange}
                          className="w-full rounded-md border border-white/10 bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-6 w-full rounded-md bg-[#1E88E5] py-2 font-medium text-white transition-all hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/70 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? "Creating Account..." : "Create Student Account"}
                    </button>
                  </form>
                </TabsContent>
                
                <TabsContent value="teacher">
                  <form onSubmit={handleTeacherSignup} className="space-y-4">
                    {/* Profile Image Upload */}
                    <div className="mb-6 flex flex-col items-center">
                      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-secondary">
                        {imagePreview ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile Preview" 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User className="h-12 w-12 text-white/50" />
                          </div>
                        )}
                        <label 
                          htmlFor="teacher-profile-image" 
                          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-cuet-blue text-white"
                        >
                          <Camera size={14} />
                        </label>
                        <input 
                          type="file" 
                          id="teacher-profile-image" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange} 
                        />
                      </div>
                      <p className="mt-2 text-xs text-white/60">Upload profile picture</p>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label htmlFor="teacherFullName" className="mb-1 block text-sm text-white/90">
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                          <User size={16} />
                        </span>
                        <input
                          id="teacherFullName"
                          name="fullName"
                          type="text"
                          placeholder="Dr. Jane Smith"
                          value={teacherForm.fullName}
                          onChange={handleTeacherChange}
                          className={`w-full rounded-md border ${errors.teacherFullName ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                        />
                      </div>
                      {errors.teacherFullName && (
                        <p className="mt-1 flex items-center text-xs text-red-400">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.teacherFullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="teacherEmail" className="mb-1 block text-sm text-white/90">
                        Official CUET Email
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                          <Mail size={16} />
                        </span>
                        <input
                          id="teacherEmail"
                          name="email"
                          type="email"
                          placeholder="faculty456@cuet.ac.bd"
                          value={teacherForm.email}
                          onChange={handleTeacherChange}
                          className={`w-full rounded-md border ${errors.teacherEmail ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                        />
                      </div>
                      {errors.teacherEmail && (
                        <p className="mt-1 flex items-center text-xs text-red-400">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.teacherEmail}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Password */}
                      <div className="col-span-1">
                        <label htmlFor="teacherPassword" className="mb-1 block text-sm text-white/90">
                          Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                            <Key size={16} />
                          </span>
                          <input
                            id="teacherPassword"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={teacherForm.password}
                            onChange={handleTeacherChange}
                            className={`w-full rounded-md border ${errors.teacherPassword ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                          />
                        </div>
                        {errors.teacherPassword && (
                          <p className="mt-1 flex items-center text-xs text-red-400">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.teacherPassword}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="col-span-1">
                        <label htmlFor="teacherConfirmPassword" className="mb-1 block text-sm text-white/90">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                            <Key size={16} />
                          </span>
                          <input
                            id="teacherConfirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={teacherForm.confirmPassword}
                            onChange={handleTeacherChange}
                            className={`w-full rounded-md border ${errors.teacherConfirmPassword ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                          />
                        </div>
                        {errors.teacherConfirmPassword && (
                          <p className="mt-1 flex items-center text-xs text-red-400">
                            <AlertCircle size={12} className="mr-1" />
                            {errors.teacherConfirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Department */}
                    <div>
                      <label htmlFor="teacherDepartment" className="mb-1 block text-sm text-white/90">
                        Department
                      </label>
                      <select
                        id="teacherDepartment"
                        name="department"
                        value={teacherForm.department}
                        onChange={handleTeacherChange}
                        className={`w-full rounded-md border ${errors.teacherDepartment ? 'border-red-500' : 'border-white/10'} bg-white/5 px-3 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                      >
                        <option value="" disabled>
                          Select Department
                        </option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {errors.teacherDepartment && (
                        <p className="mt-1 flex items-center text-xs text-red-400">
                          <AlertCircle size={12} className="mr-1" />
                          {errors.teacherDepartment}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mt-6 w-full rounded-md bg-[#1E88E5] py-2 font-medium text-white transition-all hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/70 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {isLoading ? "Creating Account..." : "Create Teacher Account"}
                    </button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center text-sm text-white/70">
                Already have an account?{" "}
                <Link to="/login" className="text-[#1E88E5] hover:underline">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Signup;
