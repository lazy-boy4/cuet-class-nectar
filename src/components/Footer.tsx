
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-cuet-navy py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/lovable-uploads/3fcc6e15-16d0-4bdb-8051-bd5314406f6c.png"
                alt="CUET Logo"
                className="h-12 w-auto"
              />
              <span className="text-xl font-semibold text-white">CUET CMS</span>
            </Link>
            <p className="text-gray-400">
              Streamlining education for students and faculty at Chittagong University of
              Engineering and Technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link to="/" className="hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white">About CUET</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-white">Features</Link>
              </li>
              <li>
                <Link to="/faculty" className="hover:text-white">Faculty</Link>
              </li>
              <li>
                <Link to="/departments" className="hover:text-white">Departments</Link>
              </li>
              <li>
                <Link to="/admin-login" className="hover:text-white">Admin Login</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-4 text-gray-400">
              <li>
                <Link to="/help" className="hover:text-white">Help Center</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white">Terms of Service</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start space-x-2">
                <svg className="mt-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Chittagong University of Engineering & Technology, Chittagong-4349, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+880-31-714935</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@cuet.ac.bd</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} CUET Class Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
