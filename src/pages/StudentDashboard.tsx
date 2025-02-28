
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StudentDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Student Dashboard - CUET Class Management System";
    
    // Check if user is authenticated
    const userRole = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");
    if (!userRole || userRole !== "student") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-cuet-navy">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
          <p className="mt-4 text-white/70">Welcome to your student dashboard. This is a placeholder for your future dashboard.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StudentDashboard;
