
import React from "react";
import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contact" className="bg-cuet-dark">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-fadeIn">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/3fcc6e15-16d0-4bdb-8051-bd5314406f6c.png"
                alt="CUET Logo"
                className="h-10 w-auto"
              />
              <h3 className="text-lg font-bold text-white">CUET CMS</h3>
            </div>
            <p className="mt-4 text-white/70">
              Streamlining education for students and faculty at Chittagong University of Engineering and Technology.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className="animate-fadeIn delay-100">
            <h3 className="mb-4 text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 transition-colors hover:text-white">Home</a>
              </li>
              <li>
                <a href="#about" className="text-white/70 transition-colors hover:text-white">About CUET</a>
              </li>
              <li>
                <a href="#features" className="text-white/70 transition-colors hover:text-white">Features</a>
              </li>
              <li>
                <a href="#" className="text-white/70 transition-colors hover:text-white">Faculty</a>
              </li>
              <li>
                <a href="#" className="text-white/70 transition-colors hover:text-white">Departments</a>
              </li>
            </ul>
          </div>

          <div className="animate-fadeIn delay-200">
            <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 transition-colors hover:text-white">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-white/70 transition-colors hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-white/70 transition-colors hover:text-white">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-white/70 transition-colors hover:text-white">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-white/70 transition-colors hover:text-white">Contact Support</a>
              </li>
            </ul>
          </div>

          <div className="animate-fadeIn delay-300">
            <h3 className="mb-4 text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-white/70">
                <MapPin size={18} className="mt-1 flex-shrink-0 text-blue-400" />
                <span>Chittagong University of Engineering & Technology, Chittagong-4349, Bangladesh</span>
              </li>
              <li className="flex items-center space-x-3 text-white/70">
                <Phone size={18} className="flex-shrink-0 text-blue-400" />
                <span>+880-31-714935</span>
              </li>
              <li className="flex items-center space-x-3 text-white/70">
                <Mail size={18} className="flex-shrink-0 text-blue-400" />
                <span>info@cuet.ac.bd</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} CUET Class Management System. All rights reserved.
            {/* Admin login link - styled with low contrast */}
            <Link to="/admin-login" className="ml-4 text-white/40 hover:text-white/60 transition-colors">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
