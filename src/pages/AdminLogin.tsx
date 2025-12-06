
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Lock } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Admin Login - CUET Class Management System";
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Use the same login endpoint as regular users, assuming admin is a role
      // Or if there is a specific admin login, use that. 
      // Based on previous files, Login.tsx uses /api/auth/login.
      // Let's assume admins log in via same endpoint or we mock the auth success more accurately for now if backend isn't ready.
      // But we built admin backend! So let's use it.
      // However, to be safe and consistent with Login.tsx logic:

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store tokens - essential for Header.tsx to detect login
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("isLoggedIn", "true");

      // We might need to fetch profile to confirm role is admin
      const profileResponse = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8080"}/api/student/profile`, {
        headers: { "Authorization": `Bearer ${data.access_token}` }
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        localStorage.setItem("userRole", profile.role);

        if (profile.role !== 'admin') {
          throw new Error("Unauthorized: Access restricted to administrators.");
        }
      } else {
        // Fallback if profile fetch fails but login worked (unlikely)
        localStorage.setItem("userRole", "admin");
      }

      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!",
        duration: 3000,
      });

      // Redirect to admin dashboard
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);

    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Invalid administrator credentials. Please try again.");
      toast({
        title: "Login failed",
        description: error.message || "Invalid administrator credentials.",
        variant: "destructive",
        duration: 3000,
      });
      // Clear tokens if failed mid-way
      localStorage.removeItem("access_token");
      localStorage.removeItem("isLoggedIn");
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
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600/20">
                  <Lock className="h-8 w-8 text-blue-400" />
                </div>
                <h1 className="text-3xl font-bold text-white">Administrator Login</h1>
                <p className="mt-2 text-white/70">
                  Access the CUET Class Management System
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
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="administrator@cuet.ac.bd"
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex w-full items-center justify-center space-x-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 font-medium text-white transition-all hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
                >
                  <span>{isLoading ? "Logging in..." : "Administrator Login"}</span>
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
                  Not an administrator?{" "}
                  <Link to="/login" className="text-blue-400 hover:text-blue-300">
                    Regular login
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

export default AdminLogin;
