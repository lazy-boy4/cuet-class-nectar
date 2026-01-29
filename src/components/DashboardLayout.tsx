
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
  useScrollAnimation();
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8 reveal">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-lg text-muted-foreground">
                {description}
              </p>
            )}
            {/* Subtle gradient underline */}
            <div className="mt-4 h-px w-24 bg-gradient-to-r from-info/50 to-transparent" />
          </div>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
