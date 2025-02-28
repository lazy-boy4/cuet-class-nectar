
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          <img
            src="/lovable-uploads/3fcc6e15-16d0-4bdb-8051-bd5314406f6c.png"
            alt="CUET Logo"
            className="h-10 w-auto"
          />
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white">
              CUET Class Management
            </h1>
          </div>
        </div>

        <nav className="hidden items-center space-x-8 md:flex">
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
            <a href="#login" className="btn-secondary">
              Log In
            </a>
            <a href="#signup" className="btn-primary">
              Sign Up
            </a>
          </div>
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
            <a
              href="#login"
              className="w-full rounded-md border border-white/10 bg-white/5 py-2 text-center text-white backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Log In
            </a>
            <a
              href="#signup"
              className="w-full rounded-md bg-[#1E88E5] py-2 text-center text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
