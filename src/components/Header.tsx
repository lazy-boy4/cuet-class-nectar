import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NeuButton } from "@/components/ui/neu-button";

const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ name?: string; picture?: string } | null>(null);

  const checkUserAuth = useCallback(() => {
    const storedRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    const storedToken = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    const storedProfile = localStorage.getItem("userProfile") || sessionStorage.getItem("userProfile");

    const loggedIn = !!storedToken;
    setIsLoggedIn(loggedIn);
    setUserRole(storedRole);

    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
      } catch (error) {
        console.error("Error parsing user profile:", error);
        setUserProfile(null);
      }
    } else {
      setUserProfile(null);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkUserAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "userRole" || e.key === "userProfile" || e.key === "isLoggedIn") {
        checkUserAuth();
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkUserAuth]);

  useEffect(() => {
    checkUserAuth();
  }, [location.pathname, checkUserAuth]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_email");
      localStorage.removeItem("userRole");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userProfile");
      localStorage.removeItem("userFullName");
      localStorage.removeItem("userDepartment");
      localStorage.removeItem("userBatch");
      localStorage.removeItem("userSection");
      localStorage.removeItem("userStudentId");

      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("user_email");
      sessionStorage.removeItem("userRole");
      sessionStorage.removeItem("isLoggedIn");
      sessionStorage.removeItem("userProfile");
      sessionStorage.removeItem("userFullName");
      sessionStorage.removeItem("userDepartment");
      sessionStorage.removeItem("userBatch");
      sessionStorage.removeItem("userSection");
      sessionStorage.removeItem("userStudentId");

      setIsLoggedIn(false);
      setUserRole(null);
      setUserProfile(null);

      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        duration: 3000,
      });

      navigate("/");
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
        case "cr":
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
    if (userRole === "student" || userRole === "cr") {
      navigate("/student/profile");
    } else if (userRole === "teacher") {
      navigate("/teacher/profile");
    } else if (userRole === "admin") {
      navigate("/admin/profile");
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <button
          onClick={handleLogoClick}
          className="flex items-center space-x-3 group transition-opacity hover:opacity-80"
        >
          <img
            src="/static/cuet logo.png"
            alt="CUET Logo"
            className="h-10 w-auto"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              CUET <span className="text-muted-foreground font-normal">Class Management</span>
            </h1>
          </div>
        </button>

        {/* Desktop Navigation */}
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
              {(userRole === "student" || userRole === "cr") && (
                <Link to="/student/dashboard" className="navbar-link">
                  Dashboard
                </Link>
              )}
              <Link to="/search" className="navbar-link flex items-center space-x-1.5">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </Link>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-card border border-white/[0.08] shadow-neu-raised-sm hover:border-white/[0.15] transition-all overflow-hidden">
                    {userProfile?.picture ? (
                      <img
                        src={userProfile.picture}
                        alt={userProfile.name || "Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-card border-white/[0.08] shadow-neu-raised"
                >
                  {userProfile?.name && (
                    <>
                      <div className="flex items-center gap-3 p-3">
                        <div className="flex flex-col space-y-0.5">
                          <p className="text-sm font-medium leading-none text-foreground">
                            {userProfile.name}
                          </p>
                          {userRole && (
                            <p className="text-xs leading-none text-muted-foreground capitalize">
                              {userRole}
                            </p>
                          )}
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-white/[0.08]" />
                    </>
                  )}
                  <DropdownMenuItem 
                    onClick={handleProfileClick}
                    className="cursor-pointer hover:bg-secondary"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/[0.08]" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer hover:bg-secondary text-destructive focus:text-destructive"
                  >
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
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <NeuButton variant="outline" size="sm">
                    Log In
                  </NeuButton>
                </Link>
                <Link to="/signup">
                  <NeuButton variant="primary" size="sm">
                    Sign Up
                  </NeuButton>
                </Link>
              </div>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md bg-card border border-white/[0.08] shadow-neu-raised-sm text-foreground md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute w-full transform bg-background/98 backdrop-blur-xl border-b border-white/[0.06] px-4 py-4 transition-all duration-300 ease-out md:hidden ${
          isMenuOpen
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col space-y-2">
          {isLoggedIn ? (
            <>
              {userProfile?.name && (
                <div className="py-3 px-2 text-foreground font-medium border-b border-white/[0.08] mb-2">
                  {userProfile.name}
                </div>
              )}
              {userRole === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center py-3 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {userRole === "teacher" && (
                <Link
                  to="/teacher/dashboard"
                  className="flex items-center py-3 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {(userRole === "student" || userRole === "cr") && (
                <Link
                  to="/student/dashboard"
                  className="flex items-center py-3 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/search"
                className="flex items-center gap-2 py-3 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search size={16} />
                Search
              </Link>
              <button
                onClick={() => {
                  handleProfileClick();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 py-3 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-left"
              >
                <User size={16} />
                Profile
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-2 py-3 px-2 rounded-md text-destructive hover:bg-destructive/10 transition-colors text-left"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </>
          ) : (
            <>
              <a
                href="#about"
                className="py-3 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#features"
                className="py-3 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#contact"
                className="py-3 px-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/[0.08]">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <NeuButton variant="outline" className="w-full">
                    Log In
                  </NeuButton>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <NeuButton variant="primary" className="w-full">
                    Sign Up
                  </NeuButton>
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
