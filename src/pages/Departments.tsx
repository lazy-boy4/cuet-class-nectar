
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Building2, Users, BookOpen, Award } from "lucide-react";

const Departments = () => {
  const departments = [
    {
      code: "01",
      name: "Civil Engineering",
      description: "Design and construction of infrastructure, buildings, and transportation systems.",
      established: "1968",
      students: "600+",
      faculty: "45"
    },
    {
      code: "02", 
      name: "Electrical & Electronic Engineering",
      description: "Power systems, electronics, telecommunications, and control systems.",
      established: "1968",
      students: "800+",
      faculty: "55"
    },
    {
      code: "03",
      name: "Mechanical Engineering", 
      description: "Design, manufacturing, thermal systems, and mechanical processes.",
      established: "1968",
      students: "700+",
      faculty: "50"
    },
    {
      code: "04",
      name: "Computer Science & Engineering",
      description: "Software development, algorithms, artificial intelligence, and computing systems.",
      established: "1986",
      students: "1200+",
      faculty: "60"
    },
    {
      code: "05",
      name: "Electronics & Telecommunication Engineering",
      description: "Communication systems, signal processing, and electronic devices.",
      established: "1991",
      students: "500+",
      faculty: "35"
    },
    {
      code: "06",
      name: "Chemical Engineering",
      description: "Process design, chemical production, and environmental engineering.",
      established: "1995",
      students: "400+",
      faculty: "30"
    },
    {
      code: "07",
      name: "Materials & Metallurgical Engineering",
      description: "Materials science, metallurgy, and advanced material development.",
      established: "2000",
      students: "300+",
      faculty: "25"
    },
    {
      code: "08",
      name: "Petroleum & Mining Engineering",
      description: "Oil and gas exploration, mining operations, and resource management.",
      established: "2005",
      students: "250+",
      faculty: "20"
    },
    {
      code: "09",
      name: "Naval Architecture & Marine Engineering",
      description: "Ship design, marine systems, and offshore engineering.",
      established: "2008",
      students: "200+",
      faculty: "18"
    },
    {
      code: "10",
      name: "Architecture",
      description: "Building design, urban planning, and sustainable architecture.",
      established: "2010",
      students: "350+",
      faculty: "22"
    },
    {
      code: "11",
      name: "Urban & Regional Planning",
      description: "City planning, regional development, and spatial planning.",
      established: "2012",
      students: "180+",
      faculty: "15"
    },
    {
      code: "12",
      name: "Building Engineering & Construction Management",
      description: "Construction technology, project management, and building systems.",
      established: "2015",
      students: "150+",
      faculty: "12"
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
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Academic Departments
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Explore our 12 specialized departments offering comprehensive engineering 
              and technology programs designed to meet global standards.
            </p>
          </div>

          {/* Departments Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {departments.map((dept) => (
              <div key={dept.code} className="glass-card p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{dept.code}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{dept.name}</h3>
                    <p className="text-white/70 mb-4">{dept.description}</p>
                    
                    {/* Department Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <Users className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                        <p className="text-xs text-white/60">Students</p>
                        <p className="text-sm font-semibold text-white">{dept.students}</p>
                      </div>
                      <div className="text-center">
                        <Award className="h-5 w-5 text-green-400 mx-auto mb-1" />
                        <p className="text-xs text-white/60">Faculty</p>
                        <p className="text-sm font-semibold text-white">{dept.faculty}</p>
                      </div>
                      <div className="text-center">
                        <Building2 className="h-5 w-5 text-purple-400 mx-auto mb-1" />
                        <p className="text-xs text-white/60">Est.</p>
                        <p className="text-sm font-semibold text-white">{dept.established}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-16 grid md:grid-cols-4 gap-6">
            <div className="glass-card p-6 text-center">
              <Building2 className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">12</h3>
              <p className="text-white/70">Departments</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">5000+</h3>
              <p className="text-white/70">Total Students</p>
            </div>
            <div className="glass-card p-6 text-center">
              <Award className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">400+</h3>
              <p className="text-white/70">Faculty Members</p>
            </div>
            <div className="glass-card p-6 text-center">
              <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white">100+</h3>
              <p className="text-white/70">Programs</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Departments;
