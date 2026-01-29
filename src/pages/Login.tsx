
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { NeuButton } from "@/components/ui/neu-button";
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card";
import { NeuInput } from "@/components/ui/neu-input";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login - CUET Class Management System";
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        
        const role = userData?.role || 'student';
        redirectByRole(role);
      }
    };
    checkSession();
  }, []);

  const redirectByRole = (role: string) => {
    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "teacher":
        navigate("/teacher/dashboard");
        break;
      default:
        navigate("/student/dashboard");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (!authData.session || !authData.user) {
        throw new Error("Login failed - no session created");
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      let userRole = "student";
      let userProfile = { name: "", picture: "" };

      if (userData) {
        userRole = userData.role || "student";
        userProfile = {
          name: userData.full_name || userData.email,
          picture: userData.picture_url || "",
        };

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("isLoggedIn", "true");
        storage.setItem("user_id", authData.user.id);
        storage.setItem("user_email", authData.user.email || "");
        storage.setItem("userProfile", JSON.stringify(userProfile));
        storage.setItem("userRole", userRole);
        storage.setItem("userFullName", userData.full_name || "");
        storage.setItem("userDepartment", userData.dept_code || "");
        storage.setItem("userBatch", userData.batch || "");
        storage.setItem("userSection", userData.section || "");
        storage.setItem("userStudentId", userData.student_id || "");
      } else {
        if (email.includes("@student.cuet.ac.bd")) {
          userRole = "student";
        } else if (email.includes("@cuet.ac.bd")) {
          userRole = "teacher";
        }
        if (email === "admin@cuet.ac.bd") {
          userRole = "admin";
        }
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("isLoggedIn", "true");
        storage.setItem("userRole", userRole);
        storage.setItem("userProfile", JSON.stringify({ name: email.split("@")[0], picture: "" }));
      }

      toast({
        title: "Login successful",
        description: `Welcome back to CUET Class Management System!`,
        duration: 3000,
      });

      setTimeout(() => {
        redirectByRole(userRole);
      }, 500);
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email before logging in.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
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
          <div className="mx-auto max-w-md">
            <NeuCard variant="raised" className="p-8">
              <NeuCardContent className="p-0">
                {/* Header */}
                <div className="mb-8 text-center">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    Welcome Back
                  </h1>
                  <p className="mt-2 text-muted-foreground">
                    Login to access your CUET dashboard
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <NeuInput
                    id="email"
                    type="email"
                    label="CUET Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@cuet.ac.bd"
                    required
                  />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                        Password
                      </label>
                      <Link to="/forgot-password" className="text-sm text-info hover:text-info/80 transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="flex h-11 w-full rounded-md px-4 py-3 pr-10 text-base transition-all duration-150 bg-luxe-black border border-white/[0.08] shadow-neu-inset text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-info focus:ring-2 focus:ring-info/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <div 
                      onClick={() => setRememberMe(!rememberMe)}
                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-all ${
                        rememberMe 
                          ? 'bg-info border-info' 
                          : 'border-white/[0.15] bg-luxe-black shadow-neu-inset'
                      }`}
                    >
                      {rememberMe && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <label 
                      htmlFor="remember-me" 
                      className="ml-3 block text-sm text-muted-foreground cursor-pointer"
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <NeuButton
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="w-full group"
                  >
                    <span>{isLoading ? "Logging in..." : "Login"}</span>
                    {!isLoading && (
                      <ArrowRight
                        size={18}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    )}
                  </NeuButton>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-info hover:text-info/80 font-medium transition-colors">
                      Sign up
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

export default Login;
