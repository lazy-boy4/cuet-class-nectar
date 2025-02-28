
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.title = "Forgot Password - CUET Class Management System";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Frontend-only mock password reset
      // In a real app, this would be a request to your backend
      console.log("Password reset requested for:", email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success state
      setIsSuccess(true);
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for further instructions.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Error",
        description: "Failed to send password reset email. Please try again.",
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
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
                <p className="mt-2 text-white/70">
                  Enter your email to receive a password reset link
                </p>
              </div>

              {isSuccess ? (
                <div className="rounded-md bg-green-500/10 p-6 text-center">
                  <h3 className="mb-2 text-xl font-medium text-green-400">Email Sent!</h3>
                  <p className="mb-4 text-white/70">
                    We've sent a password reset link to your email. Please check your inbox and follow the instructions.
                  </p>
                  <Link
                    to="/login"
                    className="group inline-flex items-center justify-center space-x-2 rounded-md bg-white/10 px-4 py-2 text-white transition-all hover:bg-white/20"
                  >
                    <span>Back to Login</span>
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-white/70">
                      CUET Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@cuet.ac.bd"
                      required
                      className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group flex w-full items-center justify-center space-x-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                  >
                    <span>{isLoading ? "Sending..." : "Send Reset Link"}</span>
                    {!isLoading && (
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    )}
                  </button>

                  <div className="text-center">
                    <Link to="/login" className="text-sm text-blue-400 hover:text-blue-300">
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
    </div>
  );
};

export default ForgotPassword;
