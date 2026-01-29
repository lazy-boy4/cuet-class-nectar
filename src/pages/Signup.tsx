
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card";
import { NeuButton } from "@/components/ui/neu-button";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Student form state
  const [studentCuetId, setStudentCuetId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentConfirmPassword, setStudentConfirmPassword] = useState("");
  const [studentDepartment, setStudentDepartment] = useState("");
  const [studentBatch, setStudentBatch] = useState("");
  const [studentSection, setStudentSection] = useState("");

  // Teacher form state
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherConfirmPassword, setTeacherConfirmPassword] = useState("");
  const [teacherDepartment, setTeacherDepartment] = useState("");

  useEffect(() => {
    document.title = "Sign Up - CUET Class Management System";
  }, []);

  useEffect(() => {
    if (studentCuetId) {
      setStudentEmail(`u${studentCuetId}@student.cuet.ac.bd`);
    }
  }, [studentCuetId]);

  const departments = [
    { code: "01", name: "01 - Civil Engineering" },
    { code: "02", name: "02 - Electrical and Electronic Engineering" },
    { code: "03", name: "03 - Mechanical Engineering" },
    { code: "04", name: "04 - Computer Science and Engineering" },
    { code: "05", name: "05 - Urban & Regional Planning" },
    { code: "06", name: "06 - Architecture" },
    { code: "07", name: "07 - Petroleum and Mining Engineering" },
    { code: "08", name: "08 - Electronics and Telecommunication Engineering" },
    { code: "09", name: "09 - Mechatronics and Industrial Engineering" },
    { code: "10", name: "10 - Water Resources Engineering" },
    { code: "11", name: "11 - Biomedical Engineering" },
    { code: "12", name: "12 - Materials and Metallurgical Engineering" },
  ];

  const inputClass = "flex h-11 w-full rounded-md px-4 py-3 text-base transition-all duration-150 bg-luxe-black border border-white/[0.08] shadow-neu-inset text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-info focus:ring-2 focus:ring-info/10";
  const labelClass = "block text-sm font-medium text-muted-foreground mb-2";
  const selectClass = "flex h-11 w-full rounded-md px-4 py-3 text-base transition-all duration-150 bg-luxe-black border border-white/[0.08] shadow-neu-inset text-foreground focus:outline-none focus:border-info focus:ring-2 focus:ring-info/10 [&>option]:bg-luxe-charcoal [&>option]:text-foreground";

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (studentPassword !== studentConfirmPassword) {
        throw new Error("Passwords don't match");
      }
      if (studentPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      if (!/^\d{7}$/.test(studentCuetId)) {
        throw new Error("CUET ID must be a 7-digit number");
      }
      if (!studentDepartment) {
        throw new Error("Please select a department");
      }

      const deptCode = studentDepartment.split(" - ")[0];

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: studentEmail,
        password: studentPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: studentName,
            role: 'student',
          }
        }
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          throw new Error("An account with this email already exists. Please login instead.");
        }
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Signup failed - please try again");
      }

      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: studentEmail,
          full_name: studentName,
          role: 'student',
          student_id: studentCuetId,
          dept_code: deptCode,
          batch: studentBatch,
          section: studentSection || 'A',
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      if (authData.session) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user_id", authData.user.id);
        localStorage.setItem("user_email", studentEmail);
        localStorage.setItem("userRole", "student");
        localStorage.setItem("userProfile", JSON.stringify({
          name: studentName,
          picture: "",
        }));
        localStorage.setItem("userFullName", studentName);

        toast({
          title: "Welcome to CUET Class Management!",
          description: "Your account has been created and you're now logged in.",
          duration: 3000,
        });

        navigate("/student/dashboard");
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please verify your email to continue.",
          duration: 5000,
        });
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during signup");
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (teacherPassword !== teacherConfirmPassword) {
        throw new Error("Passwords don't match");
      }
      if (teacherPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      if (!teacherEmail.endsWith("@cuet.ac.bd")) {
        throw new Error("Please use your official CUET email");
      }
      if (!teacherDepartment) {
        throw new Error("Please select a department");
      }

      const deptCode = teacherDepartment.split(" - ")[0];

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: teacherEmail,
        password: teacherPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: teacherName,
            role: 'teacher',
          }
        }
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          throw new Error("An account with this email already exists. Please login instead.");
        }
        throw new Error(authError.message);
      }

      if (!authData.user) {
        throw new Error("Signup failed - please try again");
      }

      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: teacherEmail,
          full_name: teacherName,
          role: 'teacher',
          dept_code: deptCode,
        });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      if (authData.session) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user_id", authData.user.id);
        localStorage.setItem("user_email", teacherEmail);
        localStorage.setItem("userRole", "teacher");
        localStorage.setItem("userProfile", JSON.stringify({
          name: teacherName,
          picture: "",
        }));
        localStorage.setItem("userFullName", teacherName);

        toast({
          title: "Welcome to CUET Class Management!",
          description: "Your teacher account has been created and you're now logged in.",
          duration: 3000,
        });

        navigate("/teacher/dashboard");
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link. Please verify your email to continue.",
          duration: 5000,
        });
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setError(error.message || "An error occurred during signup");
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-16">
        {/* Background mesh */}
        <div className="absolute inset-0 hero-mesh opacity-30 pointer-events-none" />
        
        <div className="container relative z-10 mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <NeuCard variant="raised" className="p-8">
              <NeuCardContent className="p-0">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    Create an Account
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Join CUET's Class Management System
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Tabs */}
                <Tabs defaultValue="student" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-luxe-black p-1 rounded-lg border border-white/[0.06]">
                    <TabsTrigger 
                      value="student" 
                      className="data-[state=active]:bg-card data-[state=active]:shadow-neu-raised-sm rounded-md transition-all"
                    >
                      Student
                    </TabsTrigger>
                    <TabsTrigger 
                      value="teacher"
                      className="data-[state=active]:bg-card data-[state=active]:shadow-neu-raised-sm rounded-md transition-all"
                    >
                      Teacher
                    </TabsTrigger>
                  </TabsList>

                  {/* Student Form */}
                  <TabsContent value="student">
                    <form onSubmit={handleStudentSignup} className="space-y-5">
                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label htmlFor="studentCuetId" className={labelClass}>CUET ID*</label>
                          <input
                            id="studentCuetId"
                            type="text"
                            value={studentCuetId}
                            onChange={(e) => setStudentCuetId(e.target.value)}
                            placeholder="2309026"
                            required
                            className={inputClass}
                          />
                          <p className="text-xs text-muted-foreground/60 mt-1.5">7-digit ID starting with batch year</p>
                        </div>
                        <div>
                          <label htmlFor="studentName" className={labelClass}>Full Name*</label>
                          <input
                            id="studentName"
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Your full name"
                            required
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="studentEmail" className={labelClass}>CUET Email*</label>
                        <input
                          id="studentEmail"
                          type="email"
                          value={studentEmail}
                          readOnly
                          placeholder="u2309026@student.cuet.ac.bd"
                          className={`${inputClass} cursor-not-allowed opacity-70`}
                        />
                        <p className="text-xs text-muted-foreground/60 mt-1.5">Email is auto-generated based on your CUET ID</p>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label htmlFor="studentPassword" className={labelClass}>Password*</label>
                          <input
                            id="studentPassword"
                            type="password"
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className={inputClass}
                          />
                          <p className="text-xs text-muted-foreground/60 mt-1.5">Min. 8 characters</p>
                        </div>
                        <div>
                          <label htmlFor="studentConfirmPassword" className={labelClass}>Confirm Password*</label>
                          <input
                            id="studentConfirmPassword"
                            type="password"
                            value={studentConfirmPassword}
                            onChange={(e) => setStudentConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label htmlFor="studentDepartment" className={labelClass}>Department*</label>
                          <select
                            id="studentDepartment"
                            value={studentDepartment}
                            onChange={(e) => setStudentDepartment(e.target.value)}
                            required
                            className={selectClass}
                          >
                            <option value="" disabled>Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept.code} value={dept.name}>{dept.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="studentBatch" className={labelClass}>Batch*</label>
                          <input
                            id="studentBatch"
                            type="text"
                            value={studentBatch}
                            onChange={(e) => setStudentBatch(e.target.value)}
                            placeholder="2023-2024"
                            required
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="studentSection" className={labelClass}>Section (Optional)</label>
                        <input
                          id="studentSection"
                          type="text"
                          value={studentSection}
                          onChange={(e) => setStudentSection(e.target.value)}
                          placeholder="A"
                          className={inputClass}
                        />
                      </div>

                      <NeuButton
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        className="w-full group"
                      >
                        <span>{isLoading ? "Creating Account..." : "Create Student Account"}</span>
                        {!isLoading && (
                          <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                        )}
                      </NeuButton>
                    </form>
                  </TabsContent>

                  {/* Teacher Form */}
                  <TabsContent value="teacher">
                    <form onSubmit={handleTeacherSignup} className="space-y-5">
                      <div>
                        <label htmlFor="teacherName" className={labelClass}>Full Name*</label>
                        <input
                          id="teacherName"
                          type="text"
                          value={teacherName}
                          onChange={(e) => setTeacherName(e.target.value)}
                          placeholder="Your full name"
                          required
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label htmlFor="teacherEmail" className={labelClass}>CUET Email*</label>
                        <input
                          id="teacherEmail"
                          type="email"
                          value={teacherEmail}
                          onChange={(e) => setTeacherEmail(e.target.value)}
                          placeholder="your.name@cuet.ac.bd"
                          required
                          className={inputClass}
                        />
                        <p className="text-xs text-muted-foreground/60 mt-1.5">Use your official CUET email (@cuet.ac.bd)</p>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <label htmlFor="teacherPassword" className={labelClass}>Password*</label>
                          <input
                            id="teacherPassword"
                            type="password"
                            value={teacherPassword}
                            onChange={(e) => setTeacherPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className={inputClass}
                          />
                          <p className="text-xs text-muted-foreground/60 mt-1.5">Min. 8 characters</p>
                        </div>
                        <div>
                          <label htmlFor="teacherConfirmPassword" className={labelClass}>Confirm Password*</label>
                          <input
                            id="teacherConfirmPassword"
                            type="password"
                            value={teacherConfirmPassword}
                            onChange={(e) => setTeacherConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="teacherDepartment" className={labelClass}>Department*</label>
                        <select
                          id="teacherDepartment"
                          value={teacherDepartment}
                          onChange={(e) => setTeacherDepartment(e.target.value)}
                          required
                          className={selectClass}
                        >
                          <option value="" disabled>Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept.code} value={dept.name}>{dept.name}</option>
                          ))}
                        </select>
                      </div>

                      <NeuButton
                        type="submit"
                        variant="primary"
                        disabled={isLoading}
                        className="w-full group"
                      >
                        <span>{isLoading ? "Creating Account..." : "Create Teacher Account"}</span>
                        {!isLoading && (
                          <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                        )}
                      </NeuButton>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-info hover:text-info/80 font-medium transition-colors">
                      Log in
                    </Link>
                  </p>
                </div>
              </NeuCardContent>
            </NeuCard>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
