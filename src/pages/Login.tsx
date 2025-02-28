
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Mail, Key, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set the page title
  useEffect(() => {
    document.title = "Login - CUET Class Management System";
  }, []);

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!formData.email.endsWith("@cuet.ac.bd") && !formData.email.endsWith("@student.cuet.ac.bd")) {
      newErrors.email = "Please enter a valid CUET email address";
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Determine user role and redirect accordingly
        let userRole = "student"; // Default role
        
        // Check if teacher
        const { data: teacherData } = await supabase
          .from("teachers")
          .select("*")
          .eq("user_id", data.user.id)
          .single();
          
        if (teacherData) {
          userRole = "teacher";
        } else {
          // Check if admin
          const { data: adminData } = await supabase
            .from("admins")
            .select("*")
            .eq("user_id", data.user.id)
            .single();
            
          if (adminData) {
            userRole = "admin";
          }
        }
        
        // Store user data in local storage
        if (rememberMe) {
          localStorage.setItem("userRole", userRole);
        } else {
          sessionStorage.setItem("userRole", userRole);
        }
        
        toast({
          title: "Login successful!",
          description: `Welcome back to CUET Class Management System.`,
          duration: 5000,
        });
        
        // Redirect based on role
        switch (userRole) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "teacher":
            navigate("/teacher/dashboard");
            break;
          default:
            navigate("/student/dashboard");
            break;
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password.",
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
          <div className="reveal mx-auto max-w-md">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-white md:text-4xl">Log In</h1>
              <p className="mt-2 text-white/70">
                Access your CUET Class Management portal
              </p>
            </div>
            
            <div className="glass-card overflow-hidden p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm text-white/90">
                    CUET Email
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                      <Mail size={16} />
                    </span>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@cuet.ac.bd"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 flex items-center text-xs text-red-400">
                      <AlertCircle size={12} className="mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label htmlFor="password" className="text-sm text-white/90">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-xs text-[#1E88E5] hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/60">
                      <Key size={16} />
                    </span>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
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

                {/* Remember Me */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#1E88E5] focus:ring-[#1E88E5]/50"
                  />
                  <label htmlFor="remember-me" className="text-sm text-white/90">
                    Remember me
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 w-full rounded-md bg-[#1E88E5] py-2 font-medium text-white transition-all hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/70 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? "Logging in..." : "Log In"}
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm text-white/70">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#1E88E5] hover:underline">
                  Sign up
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

export default Login;
