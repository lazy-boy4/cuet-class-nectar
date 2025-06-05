import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronRight, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ name?: string; picture?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Mock authentication check - replaces Supabase auth
    const checkUserAuth = () => {
      const storedRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
      const storedLoginStatus = localStorage.getItem("isLoggedIn") === "true";
      const storedProfile = localStorage.getItem("userProfile");
      
      setIsLoggedIn(storedLoginStatus);
      setUserRole(storedRole);
      
      if (storedProfile) {
        try {
          setUserProfile(JSON.parse(storedProfile));
        } catch (error) {
          console.error("Error parsing user profile:", error);
        }
      }
    };

    checkUserAuth();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("userRole");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userProfile");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("userProfile");
      setIsLoggedIn(false);
      setUserRole(null);
      setUserProfile(null);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        duration: 3000,
      });
      
      // Navigate to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogoClick = () => {
    if (isLoggedIn && userRole) {
      switch (userRole) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;
        case "student":
          navigate("/student/dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    if (userRole === "student") {
      navigate("/student/profile");
    } else if (userRole === "teacher") {
      navigate("/teacher/profile");
    } else if (userRole === "admin") {
      navigate("/admin/profile");
    }
  };

  const getUserInitials = () => {
    if (userProfile?.name) {
      return userProfile.name
        .split(" ")
        .map(name => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "U";
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-cuet-navy/90 shadow-md backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <button onClick={handleLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img
              src="/static/cuet logo.png"
              alt="CUET Logo"
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white">
                CUET Class Management
              </h1>
            </div>
          </button>
        </div>

        <nav className="hidden items-center space-x-8 md:flex">
          {isLoggedIn ? (
            <>
              {userRole === "admin" && (
                <Link to="/admin/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              {userRole === "teacher" && (
                <Link to="/teacher/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              {userRole === "student" && (
                <Link to="/student/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 rounded-full p-1 hover:bg-white/10 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.picture} alt={userProfile?.name || "Profile"} />
                      <AvatarFallback className="bg-blue-600 text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <a href="#about" className="navbar-link">
                About
              </a>
              <a href="#features" className="navbar-link">
                Features
              </a>
              <a href="#contact" className="navbar-link">
                Contact
              </a>
              <div className="flex space-x-3">
                <Link to="/login" className="btn-secondary">
                  Log In
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </nav>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/5 text-white backdrop-blur-sm md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute w-full transform bg-cuet-navy/95 px-4 py-4 backdrop-blur-lg transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        }`}
      >
        <nav className="flex flex-col space-y-4">
          {isLoggedIn ? (
            <>
              {userRole === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center space-x-1 py-2 text-white/80 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Dashboard</span>
                  <ChevronRight size={16} />
                </Link>
              )}
              {userRole === "teacher" && (
                <Link
                  to="/teacher/dashboard"
                  className="flex items-center space-x-1 py-2 text-white/80 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Dashboard</span>
                  <ChevronRight size={16} />
                </Link>
              )}
              {userRole === "student" && (
                <Link
                  to="/student/dashboard"
                  className="flex items-center space-x-1 py-2 text-white/80 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Dashboard</span>
                  <ChevronRight size={16} />
                </Link>
              )}
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-1 py-2 text-white/80 hover:text-white text-left"
              >
                <User size={16} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-1 py-2 text-white/80 hover:text-white text-left"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <>
              <a
                href="#about"
                className="flex items-center space-x-1 py-2 text-white/80 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>About</span>
                <ChevronRight size={16} />
              </a>
              <a
                href="#features"
                className="flex items-center space-x-1 py-2 text-white/80 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Features</span>
                <ChevronRight size={16} />
              </a>
              <a
                href="#contact"
                className="flex items-center space-x-1 py-2 text-white/80 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Contact</span>
                <ChevronRight size={16} />
              </a>
              <div className="flex flex-col space-y-3 pt-2">
                <Link
                  to="/login"
                  className="w-full rounded-md border border-white/10 bg-white/5 py-2 text-center text-white backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="w-full rounded-md bg-[#1E88E5] py-2 text-center text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
