
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Key, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Set the page title
  useEffect(() => {
    document.title = "Reset Password - CUET Class Management System";
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
    
    // Validate password
    if (formData.password.length < 8 || !/[a-zA-Z]/.test(formData.password) || !/\d/.test(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with letters and numbers";
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password updated!",
        description: "Your password has been successfully reset.",
        duration: 5000,
      });
      
      // Redirect to login page
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: error.message || "Failed to reset password. Please try again.",
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
              <h1 className="text-3xl font-bold text-white md:text-4xl">Reset Password</h1>
              <p className="mt-2 text-white/70">
                Create a new password for your account
              </p>
            </div>
            
            <div className="glass-card overflow-hidden p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New Password */}
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm text-white/90">
                    New Password
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

                {/* Confirm New Password */}
                <div>
                  <label htmlFor="confirmPassword" className="mb-1 block text-sm text-white/90">
                    Confirm New Password
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
                      value={formData.confirmPassword}
                      onChange={handleChange}
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 w-full rounded-md bg-[#1E88E5] py-2 font-medium text-white transition-all hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/70 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? "Updating..." : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ResetPassword;
