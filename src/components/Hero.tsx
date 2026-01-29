
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { NeuButton } from "@/components/ui/neu-button";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 hero-mesh" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-info/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-icon-purple/5 blur-3xl animate-float delay-200" />
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-32 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center rounded-full bg-card px-4 py-1.5 border border-white/[0.08] shadow-neu-raised-sm">
          <span className="text-xs font-medium text-muted-foreground">
            CUET Class Management System
          </span>
        </div>

        {/* Main heading */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          The Future of
          <span className="block mt-2 gradient-platinum">
            Academic Management
          </span>
        </h1>
        
        {/* Subheading */}
        <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Streamlining education for students and faculty at Chittagong
          University of Engineering and Technology with a premium, modern platform.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link to="/login">
            <NeuButton variant="primary" size="lg" className="group">
              <span>Get Started</span>
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </NeuButton>
          </Link>
          <a href="#about">
            <NeuButton variant="outline" size="lg">
              Learn More
            </NeuButton>
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { value: "12+", label: "Departments" },
            { value: "5000+", label: "Students" },
            { value: "200+", label: "Faculty Members" },
          ].map(({ value, label }, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl font-bold text-foreground md:text-4xl">
                {value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
