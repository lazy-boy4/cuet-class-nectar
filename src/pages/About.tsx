
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building, Users, Award, Globe } from "lucide-react";

const About = () => {
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
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              About Chittagong University of Engineering & Technology
            </h1>
            <p className="text-xl text-white/80">
              Excellence in Engineering Education Since 1968
            </p>
          </div>

          {/* University Overview */}
          <div className="glass-card p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Our Legacy</h2>
                <p className="text-white/80 mb-4">
                  Chittagong University of Engineering & Technology (CUET) is a premier 
                  engineering institution in Bangladesh, established in 1968. Located in 
                  the port city of Chittagong, CUET has been at the forefront of 
                  engineering education and research for over five decades.
                </p>
                <p className="text-white/80">
                  With a commitment to excellence, innovation, and social responsibility, 
                  CUET continues to produce skilled engineers and technologists who 
                  contribute significantly to national and international development.
                </p>
              </div>
              <div className="text-center">
                <img
                  src="/static/cuet logo.png"
                  alt="CUET Logo"
                  className="h-48 w-auto mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="glass-card p-6 text-center">
              <Building className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">12</h3>
              <p className="text-white/70">Departments</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">8000+</h3>
              <p className="text-white/70">Students</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Award className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">500+</h3>
              <p className="text-white/70">Faculty Members</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Globe className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">50+</h3>
              <p className="text-white/70">Years of Excellence</p>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-white/80">
                To provide quality education in engineering and technology, conduct 
                research for national development, and produce competent engineers 
                and technologists with ethical values to serve humanity.
              </p>
            </div>
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-white/80">
                To be a center of excellence in engineering education and research, 
                contributing to sustainable development and technological advancement 
                in Bangladesh and beyond.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
