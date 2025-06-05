
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Mail, Phone, MapPin, Clock, 
  Send, User, MessageSquare, AlertCircle 
} from "lucide-react";

const Support = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: "medium"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Support request submitted:", formData);
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
      priority: "medium"
    });
    alert("Your support request has been submitted. We'll get back to you soon!");
  };

  const supportCategories = [
    "Account Issues",
    "Class Enrollment",
    "Attendance Problems", 
    "Technical Issues",
    "Password Reset",
    "Permission Issues",
    "System Bugs",
    "Feature Requests",
    "Other"
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
            <MessageSquare className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Contact Support
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Need help? Our support team is here to assist you with any questions 
              or issues you may have with the CUET Class Management System.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-white font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white font-medium mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your.email@cuet.ac.bd"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-white font-medium mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a category</option>
                      {supportCategories.map((category) => (
                        <option key={category} value={category} className="bg-cuet-navy">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="priority" className="block text-white font-medium mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low" className="bg-cuet-navy">Low</option>
                      <option value="medium" className="bg-cuet-navy">Medium</option>
                      <option value="high" className="bg-cuet-navy">High</option>
                      <option value="urgent" className="bg-cuet-navy">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    placeholder="Describe your issue in detail. Include any error messages, steps to reproduce the problem, and any other relevant information."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Contact Information & Other Options */}
            <div className="space-y-8">
              {/* Contact Details */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">Email Support</h3>
                      <p className="text-white/70">support@cuet.ac.bd</p>
                      <p className="text-white/60 text-sm">Response time: 24-48 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">Phone Support</h3>
                      <p className="text-white/70">+880-31-714935</p>
                      <p className="text-white/60 text-sm">Available: 9 AM - 5 PM (Sat-Thu)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold">Visit Us</h3>
                      <p className="text-white/70">IT Support Office</p>
                      <p className="text-white/70">CUET Campus, Chittagong-4349</p>
                      <p className="text-white/60 text-sm">Office hours: 9 AM - 5 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Times */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Response Times</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <span className="text-white font-medium">Urgent:</span>
                      <span className="text-white/70 ml-2">Within 4 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div>
                      <span className="text-white font-medium">High:</span>
                      <span className="text-white/70 ml-2">Within 24 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <span className="text-white font-medium">Medium:</span>
                      <span className="text-white/70 ml-2">Within 48 hours</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <span className="text-white font-medium">Low:</span>
                      <span className="text-white/70 ml-2">Within 1 week</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Quick Help</h2>
                <div className="space-y-3">
                  <Link
                    to="/help"
                    className="block w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                  >
                    Browse Help Center
                  </Link>
                  <Link
                    to="/faq"
                    className="block w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                  >
                    Check FAQ
                  </Link>
                  <Link
                    to="/forgot-password"
                    className="block w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
                  >
                    Reset Password
                  </Link>
                </div>
              </div>

              {/* Emergency Notice */}
              <div className="glass-card p-6 border-l-4 border-red-500">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Emergency Support</h3>
                    <p className="text-white/70 text-sm">
                      For critical system issues affecting multiple users, please call our 
                      emergency hotline immediately: <strong>+880-31-714935</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Support;
