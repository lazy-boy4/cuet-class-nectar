import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-white/[0.06]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                alt="CUET Logo"
                className="h-12 w-auto"
                src="/static/cuet logo.png"
              />
              <span className="text-xl font-semibold text-foreground">
                CUET <span className="text-muted-foreground font-normal">CMS</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Streamlining education for students and faculty at Chittagong
              University of Engineering and Technology.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
              ].map(({ icon: Icon, href }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-card border border-white/[0.06] text-muted-foreground shadow-neu-raised-sm transition-all hover:text-foreground hover:border-white/[0.12] hover:-translate-y-0.5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "About CUET", to: "/about" },
                { label: "Features", to: "/features" },
                { label: "Faculty", to: "/faculty" },
                { label: "Departments", to: "/departments" },
                { label: "Admin Login", to: "/admin-login" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-6 text-sm font-semibold text-foreground uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Help Center", to: "/help" },
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
                { label: "FAQ", to: "/faq" },
                { label: "Contact Support", to: "/support" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-muted-foreground text-sm hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="mb-6 text-sm font-semibold text-foreground uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Chittagong University of Engineering & Technology,
                  Chittagong-4349, Bangladesh
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  +880-31-714935
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  info@cuet.ac.bd
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <p className="text-center text-muted-foreground text-sm">
            © {currentYear} CUET Class Management System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
