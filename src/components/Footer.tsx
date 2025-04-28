
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-cuet-navy/90 py-8 text-white/70">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/3fcc6e15-16d0-4bdb-8051-bd5314406f6c.png"
                alt="CUET Logo"
                className="h-12 w-auto"
              />
              <div className="ml-3">
                <h2 className="text-lg font-bold text-white">CUET</h2>
                <p className="text-xs text-white/70">Class Management System</p>
              </div>
            </Link>
            <p className="mt-4 text-sm">
              A comprehensive platform for managing classes, courses, attendance,
              and notices at Chittagong University of Engineering and Technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-medium text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <Link to="/notices" className="hover:text-white">
                  Notice Board
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-base font-medium text-white">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Chittagong University of Engineering & Technology</li>
              <li>Pahartali, Chattogram-4349, Bangladesh</li>
              <li>Email: info@cuet.ac.bd</li>
              <li>Phone: +880-31-714910</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between border-t border-white/10 pt-6 text-xs md:flex-row">
          <p>&copy; {new Date().getFullYear()} CUET Class Management System. All rights reserved.</p>
          <div className="mt-4 space-x-4 md:mt-0">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
            <Link to="/admin-login" className="text-white/40 hover:text-white/70">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
