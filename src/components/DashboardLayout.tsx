
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useScrollAnimation } from "@/utils/useScrollAnimation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const DashboardLayout = ({ children, title, description }: DashboardLayoutProps) => {
  // Initialize scroll animation
  useScrollAnimation();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-cuet-navy pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 reveal">
            <h1 className="text-3xl font-bold text-white md:text-4xl">{title}</h1>
            {description && (
              <p className="mt-2 text-lg text-white/70">{description}</p>
            )}
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
