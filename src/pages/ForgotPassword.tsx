
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Mail, AlertCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Set the page title
  useEffect(() => {
    document.title = "Forgot Password - CUET Class Management System";
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!email.endsWith("@cuet.ac.bd") && !email.endsWith("@student.cuet.ac.bd")) {
      setError("Please enter a valid CUET email address");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link.",
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Request failed",
        description: error.message || "Failed to send reset link. Please try again.",
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
              <h1 className="text-3xl font-bold text-white md:text-4xl">Forgot Password</h1>
              <p className="mt-2 text-white/70">
                We'll send you a link to reset your password
              </p>
            </div>
            
            <div className="glass-card overflow-hidden p-6">
              {isSubmitted ? (
                <div className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                      <Mail size={32} className="text-green-500" />
                    </div>
                  </div>
                  <h2 className="mb-2 text-xl font-semibold text-white">Check Your Email</h2>
                  <p className="mb-6 text-white/70">
                    We've sent a password reset link to <span className="font-medium text-white">{email}</span>
                  </p>
                  <div className="flex flex-col space-y-3">
                    <Link
                      to="/login"
                      className="rounded-md bg-[#1E88E5] py-2 text-center font-medium text-white transition-all hover:bg-[#1976D2]"
                    >
                      Back to Login
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        type="email"
                        placeholder="your.email@cuet.ac.bd"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full rounded-md border ${error ? 'border-red-500' : 'border-white/10'} bg-white/5 px-10 py-2 text-white placeholder-white/30 focus:border-white/20 focus:outline-none`}
                      />
                    </div>
                    {error && (
                      <p className="mt-1 flex items-center text-xs text-red-400">
                        <AlertCircle size={12} className="mr-1" />
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-6 w-full rounded-md bg-[#1E88E5] py-2 font-medium text-white transition-all hover:bg-[#1976D2] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/70 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  
                  <div className="pt-2 text-center">
                    <Link to="/login" className="inline-flex items-center text-sm text-white/70 hover:text-white">
                      <ArrowLeft size={16} className="mr-1" />
                      Back to login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default ForgotPassword;
