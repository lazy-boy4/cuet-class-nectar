
import React, { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { useScrollAnimation } from "@/utils/useScrollAnimation";

import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  // Initialize scroll animation
  useScrollAnimation();

  // Set the page title and check auth
  useEffect(() => {
    document.title = "CUET Class Management System";

    // Check if user is logged in
    const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
    const role = localStorage.getItem("userRole") || sessionStorage.getItem("userRole");

    if (token && role) {
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Features />
        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
