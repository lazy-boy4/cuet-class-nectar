
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Auto-generate student email based on CUET ID
  useEffect(() => {
    if (studentCuetId) {
      setStudentEmail(`u${studentCuetId}@student.cuet.ac.bd`);
    }
  }, [studentCuetId]);

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

  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validation
      if (studentPassword !== studentConfirmPassword) {
        throw new Error("Passwords don't match");
      }
      
      if (studentPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      if (!/^\d{7}$/.test(studentCuetId)) {
        throw new Error("CUET ID must be a 7-digit number");
      }
      
      // In a real app, you would make an API call to create the user
      console.log("Student signup data:", {
        cuetId: studentCuetId,
        name: studentName,
        email: studentEmail,
        department: studentDepartment,
        batch: studentBatch,
        section: studentSection,
      });
      
      // Success toast
      toast({
        title: "Signup successful!",
        description: "Your student account has been created. Please log in.",
        duration: 3000,
      });
      
      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
      // Validation
      if (teacherPassword !== teacherConfirmPassword) {
        throw new Error("Passwords don't match");
      }
      
      if (teacherPassword.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
      if (!teacherEmail.endsWith("@cuet.ac.bd")) {
        throw new Error("Please use your official CUET email");
      }
      
      // In a real app, you would make an API call to create the user
      console.log("Teacher signup data:", {
        name: teacherName,
        email: teacherEmail,
        department: teacherDepartment,
      });
      
      // Success toast
      toast({
        title: "Signup successful!",
        description: "Your teacher account has been created. Please log in.",
        duration: 3000,
      });
      
      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-cuet-navy pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-white">Create an Account</h1>
                <p className="mt-2 text-white/70">
                  Join CUET's Class Management System
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-md bg-red-500/10 p-4 text-red-400">
                  {error}
                </div>
              )}

              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="teacher">Teacher</TabsTrigger>
                </TabsList>
                
                <TabsContent value="student">
                  <form onSubmit={handleStudentSignup} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="studentCuetId" className="block text-sm font-medium text-white/70">
                          CUET ID*
                        </label>
                        <input
                          id="studentCuetId"
                          type="text"
                          value={studentCuetId}
                          onChange={(e) => setStudentCuetId(e.target.value)}
                          placeholder="2309026"
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-xs text-white/50">7-digit ID starting with batch year</p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="studentName" className="block text-sm font-medium text-white/70">
                          Full Name*
                        </label>
                        <input
                          id="studentName"
                          type="text"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          placeholder="Your full name"
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="studentEmail" className="block text-sm font-medium text-white/70">
                        CUET Email*
                      </label>
                      <input
                        id="studentEmail"
                        type="email"
                        value={studentEmail}
                        readOnly
                        placeholder="u2309026@student.cuet.ac.bd"
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <p className="text-xs text-white/50">Email is auto-generated based on your CUET ID</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="studentPassword" className="block text-sm font-medium text-white/70">
                          Password*
                        </label>
                        <input
                          id="studentPassword"
                          type="password"
                          value={studentPassword}
                          onChange={(e) => setStudentPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-xs text-white/50">Min. 8 characters with letters & numbers</p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="studentConfirmPassword" className="block text-sm font-medium text-white/70">
                          Confirm Password*
                        </label>
                        <input
                          id="studentConfirmPassword"
                          type="password"
                          value={studentConfirmPassword}
                          onChange={(e) => setStudentConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="studentDepartment" className="block text-sm font-medium text-white/70">
                          Department*
                        </label>
                        <select
                          id="studentDepartment"
                          value={studentDepartment}
                          onChange={(e) => setStudentDepartment(e.target.value)}
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="" disabled>Select Department</option>
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="studentBatch" className="block text-sm font-medium text-white/70">
                          Batch*
                        </label>
                        <input
                          id="studentBatch"
                          type="text"
                          value={studentBatch}
                          onChange={(e) => setStudentBatch(e.target.value)}
                          placeholder="2023-2024"
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="studentSection" className="block text-sm font-medium text-white/70">
                        Section (Optional)
                      </label>
                      <input
                        id="studentSection"
                        type="text"
                        value={studentSection}
                        onChange={(e) => setStudentSection(e.target.value)}
                        placeholder="A"
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group flex w-full items-center justify-center space-x-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                      >
                        <span>{isLoading ? "Creating Account..." : "Create Student Account"}</span>
                        {!isLoading && (
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        )}
                      </button>
                    </div>
                  </form>
                </TabsContent>
                
                <TabsContent value="teacher">
                  <form onSubmit={handleTeacherSignup} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="teacherName" className="block text-sm font-medium text-white/70">
                        Full Name*
                      </label>
                      <input
                        id="teacherName"
                        type="text"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        placeholder="Your full name"
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="teacherEmail" className="block text-sm font-medium text-white/70">
                        CUET Email*
                      </label>
                      <input
                        id="teacherEmail"
                        type="email"
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        placeholder="faculty@cuet.ac.bd"
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <p className="text-xs text-white/50">Please use your official CUET email</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="teacherPassword" className="block text-sm font-medium text-white/70">
                          Password*
                        </label>
                        <input
                          id="teacherPassword"
                          type="password"
                          value={teacherPassword}
                          onChange={(e) => setTeacherPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <p className="text-xs text-white/50">Min. 8 characters with letters & numbers</p>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="teacherConfirmPassword" className="block text-sm font-medium text-white/70">
                          Confirm Password*
                        </label>
                        <input
                          id="teacherConfirmPassword"
                          type="password"
                          value={teacherConfirmPassword}
                          onChange={(e) => setTeacherConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="teacherDepartment" className="block text-sm font-medium text-white/70">
                        Department*
                      </label>
                      <select
                        id="teacherDepartment"
                        value={teacherDepartment}
                        onChange={(e) => setTeacherDepartment(e.target.value)}
                        required
                        className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="" disabled>Select Department</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group flex w-full items-center justify-center space-x-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                      >
                        <span>{isLoading ? "Creating Account..." : "Create Teacher Account"}</span>
                        {!isLoading && (
                          <ArrowRight
                            size={16}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                          />
                        )}
                      </button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/70">
                  Already have an account?{" "}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300">
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
