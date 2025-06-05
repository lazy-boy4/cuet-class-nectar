
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, GraduationCap } from "lucide-react";

const Faculty = () => {
  const departments = [
    "Civil Engineering",
    "Electrical & Electronic Engineering", 
    "Mechanical Engineering",
    "Computer Science & Engineering",
    "Electronics & Telecommunication Engineering",
    "Chemical Engineering",
    "Materials & Metallurgical Engineering",
    "Petroleum & Mining Engineering",
    "Naval Architecture & Marine Engineering",
    "Architecture",
    "Urban & Regional Planning",
    "Building Engineering & Construction Management"
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
              Faculty & Departments
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Meet our distinguished faculty members across 12 specialized departments, 
              dedicated to excellence in engineering education and research.
            </p>
          </div>

          {/* Faculty Overview */}
          <div className="glass-card p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <GraduationCap className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">500+</h3>
                <p className="text-white/70">Faculty Members</p>
              </div>
              <div>
                <MapPin className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">12</h3>
                <p className="text-white/70">Departments</p>
              </div>
              <div>
                <Mail className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">50+</h3>
                <p className="text-white/70">PhD Holders</p>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Our Departments
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="glass-card p-6 hover:bg-white/10 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {String(index + 1).padStart(2, '0')} - {dept}
                  </h3>
                  <p className="text-white/70 text-sm">
                    Department of {dept}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Information */}
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Faculty Excellence</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Qualifications</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• PhD holders from renowned international universities</li>
                  <li>• Experienced professionals with industry background</li>
                  <li>• Active researchers in cutting-edge technologies</li>
                  <li>• Published authors in international journals</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Research Areas</h3>
                <ul className="space-y-2 text-white/70">
                  <li>• Sustainable Engineering Solutions</li>
                  <li>• Artificial Intelligence & Machine Learning</li>
                  <li>• Renewable Energy Systems</li>
                  <li>• Advanced Materials Research</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 p-6 bg-white/5 rounded-lg">
              <p className="text-white/80 italic text-center">
                "Our faculty members are committed to providing world-class education 
                and fostering innovation through research and development."
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Faculty;
