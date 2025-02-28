
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Login - CUET Class Management System";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Frontend-only mock login for demo purposes
      // In a real app, this would be a request to your backend
      console.log("Logging in with:", { email, password, rememberMe });
      
      // Simple role check based on email domain for demo
      let userRole = "student";
      if (email.includes("@cuet.ac.bd") && !email.includes("@student.cuet.ac.bd")) {
        userRole = "teacher";
      }
      // Admin check (you can use a specific email for testing)
      if (email === "admin@cuet.ac.bd") {
        userRole = "admin";
      }
      
      // Store login state in localStorage or sessionStorage based on rememberMe
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("isLoggedIn", "true");
      storage.setItem("userRole", userRole);
      
      // Success toast
      toast({
        title: "Login successful",
        description: `Welcome back to CUET Class Management System!`,
        duration: 3000,
      });
      
      // Redirect based on role
      setTimeout(() => {
        switch (userRole) {
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "teacher":
            navigate("/teacher/dashboard");
            break;
          default:
            navigate("/student/dashboard");
        }
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password. Please try again.");
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
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
                <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                <p className="mt-2 text-white/70">
                  Login to access your CUET dashboard
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-md bg-red-500/10 p-4 text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium text-white/70">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center space-x-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                >
                  <span>{isLoading ? "Logging in..." : "Login"}</span>
                  {!isLoading && (
                    <ArrowRight
                      size={16}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-white/70">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-400 hover:text-blue-300">
                    Sign up
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

export default Login;
