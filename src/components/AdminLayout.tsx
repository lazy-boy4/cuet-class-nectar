
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Grid2X2, Database, Book, Layers, Users, UserPlus, 
  ChevronLeft, LogOut, Settings, Menu, X 
} from "lucide-react";

const AdminLayout = ({ 
  children, 
  title, 
  description 
}: { 
  children: React.ReactNode; 
  title: string;
  description?: string;
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Navigation items for the sidebar
  const navigationItems = [
    {
      name: "Dashboard",
      icon: Grid2X2,
      path: "/admin/dashboard",
    },
    {
      name: "Departments",
      icon: Database,
      path: "/admin/departments",
    },
    {
      name: "Courses",
      icon: Book,
      path: "/admin/courses",
    },
    {
      name: "Classes",
      icon: Layers,
      path: "/admin/classes",
    },
    {
      name: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      name: "Assign Teachers",
      icon: UserPlus,
      path: "/admin/assign-teachers",
    },
    {
      name: "Promote CRs",
      icon: UserPlus,
      path: "/admin/promote-crs",
    }
  ];

  // Check if admin is logged in
  useEffect(() => {
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "admin") {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userRole");
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex min-h-screen bg-cuet-navy">
      {/* Sidebar for desktop */}
      <div
        className={`fixed inset-y-0 left-0 z-20 w-64 transform overflow-y-auto border-r border-white/10 bg-white/5 backdrop-blur-lg transition-transform duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-6">
          <button onClick={handleLogoClick} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img
              src="/static/cuet logo.png"
              alt="CUET Logo"
              className="h-8 w-auto"
            />
            <span className="text-lg font-bold text-white">CUET Admin</span>
          </button>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="block lg:hidden"
          >
            <ChevronLeft className="h-5 w-5 text-white/70" />
          </button>
        </div>
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 rounded-md px-4 py-2.5 text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-white/10 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center space-x-3 rounded-md px-4 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="sticky top-0 z-10 border-b border-white/10 bg-cuet-navy/80 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className={`mr-4 text-white/70 lg:hidden ${isSidebarOpen ? "hidden" : "block"}`}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-white">{title}</h1>
            </div>
            <div>
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 hover:bg-white/10 lg:hidden"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Settings className="h-5 w-5" />
                )}
              </button>

              {/* Mobile dropdown menu */}
              {isMobileMenuOpen && (
                <div className="absolute right-4 mt-2 w-48 origin-top-right rounded-md border border-white/10 bg-cuet-navy/90 shadow-lg backdrop-blur-md lg:hidden">
                  <div className="py-1">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-white/10"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-6">
          {description && (
            <div className="mb-6">
              <p className="text-white/70">{description}</p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
