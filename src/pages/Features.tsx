
import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Calendar, Users, BookOpen, Bell, 
  BarChart3, Shield, Clock, Download 
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Class Scheduling",
      description: "Comprehensive class scheduling system with real-time updates and conflict detection.",
      color: "text-blue-400"
    },
    {
      icon: Users,
      title: "User Management",
      description: "Role-based access control for admins, teachers, students, and class representatives.",
      color: "text-green-400"
    },
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Complete course catalog management with prerequisites and credit tracking.",
      color: "text-purple-400"
    },
    {
      icon: Bell,
      title: "Notice Board",
      description: "Centralized communication platform for announcements and important updates.",
      color: "text-yellow-400"
    },
    {
      icon: BarChart3,
      title: "Attendance Tracking",
      description: "Digital attendance system with detailed analytics and reporting.",
      color: "text-red-400"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "CUET email-based authentication with JWT security and role verification.",
      color: "text-indigo-400"
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description: "Live notifications and updates for schedule changes and announcements.",
      color: "text-pink-400"
    },
    {
      icon: Download,
      title: "Bulk Operations",
      description: "Efficient bulk upload and management of student data and course materials.",
      color: "text-teal-400"
    }
  ];

  return (
    <div className="min-h-screen bg-cuet-navy">
      {/* Header */}
      <header className="border-b border-white/10 bg-cuet-navy/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              System Features
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Discover the comprehensive features that make CUET Class Management System 
              the perfect solution for academic administration and student management.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 hover:bg-white/10 transition-all duration-300">
                <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Features Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Why Choose Our System?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4">User-Friendly Interface</h3>
                <p className="text-white/70">
                  Intuitive design that makes navigation easy for all user types, 
                  from students to administrators.
                </p>
              </div>
              <div className="glass-card p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Mobile Responsive</h3>
                <p className="text-white/70">
                  Access the system from any device with our fully responsive 
                  design that works on desktop, tablet, and mobile.
                </p>
              </div>
              <div className="glass-card p-8 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Data Security</h3>
                <p className="text-white/70">
                  Enterprise-grade security with encrypted data transmission 
                  and secure authentication protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Features;
