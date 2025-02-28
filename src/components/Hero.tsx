
import React from "react";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1587652327825-f924c0f21251?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-b from-cuet-dark/70 via-cuet-dark/80 to-cuet-navy z-0"></div>

      <div className="container relative z-10 px-4 py-32 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Welcome to CUET's
          <span className="mt-2 block bg-gradient-to-r from-[#60a5fa] to-[#a78bfa] bg-clip-text text-transparent">
            Class Management System
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/80 md:text-xl">
          Streamlining education for students and faculty at Chittagong
          University of Engineering and Technology
        </p>
        <div className="mx-auto flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <a
            href="/login"
            className="group flex w-full items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] px-8 py-3 text-white transition-all duration-300 hover:from-[#1d4ed8] hover:to-[#1e40af] sm:w-auto"
          >
            <span>Get Started</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <a
            href="#about"
            className="w-full rounded-lg border border-white/20 bg-white/5 px-8 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 sm:w-auto"
          >
            Learn More
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cuet-navy to-transparent"></div>
    </section>
  );
};

export default Hero;
