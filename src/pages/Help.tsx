
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Search, HelpCircle, Book, Users, 
  Settings, MessageCircle, Phone, Mail 
} from "lucide-react";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      icon: Users,
      title: "Account Management",
      description: "Learn how to manage your account, update profile, and change passwords.",
      articles: [
        "How to reset your password",
        "Updating your profile information", 
        "Account verification process",
        "Managing notification preferences"
      ]
    },
    {
      icon: Book,
      title: "Class Management",
      description: "Everything about managing classes, attendance, and academic schedules.",
      articles: [
        "Enrolling in classes",
        "Viewing class schedules",
        "Checking attendance records",
        "Understanding attendance requirements"
      ]
    },
    {
      icon: Settings,
      title: "System Features",
      description: "Discover all the features available in the CUET Class Management System.",
      articles: [
        "Using the notice board",
        "Accessing course materials",
        "Submitting enrollment requests",
        "Understanding user roles"
      ]
    },
    {
      icon: MessageCircle,
      title: "Communication",
      description: "Learn how to communicate effectively within the system.",
      articles: [
        "Posting announcements (Teachers/CRs)",
        "Contacting system administrators",
        "Understanding notification types",
        "Managing communication preferences"
      ]
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Go to the login page and click 'Forgot Password'. Enter your CUET email address and follow the instructions sent to your email."
    },
    {
      question: "Who can approve my enrollment request?",
      answer: "Class Representatives (CRs) have the authority to approve enrollment requests for their respective classes."
    },
    {
      question: "How do I check my attendance?",
      answer: "Log into your student dashboard and navigate to the 'Classes' section to view detailed attendance records for each course."
    },
    {
      question: "Can I change my department after registration?",
      answer: "Department changes require administrative approval. Contact the system administrator through the support channels."
    },
    {
      question: "How do I become a Class Representative?",
      answer: "CRs are promoted by system administrators. Speak with your department head or contact support for the promotion process."
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
              Help Center
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
              Find answers to your questions and learn how to make the most of 
              the CUET Class Management System.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Help Categories */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Browse by Category
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {helpCategories.map((category, index) => (
                <div key={index} className="glass-card p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <category.icon className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                      <p className="text-white/70 mb-4">{category.description}</p>
                      <ul className="space-y-2">
                        {category.articles.map((article, idx) => (
                          <li key={idx} className="text-white/60 hover:text-white cursor-pointer text-sm">
                            • {article}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card p-6">
                  <div className="flex items-start space-x-3">
                    <HelpCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                      <p className="text-white/70">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="glass-card p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-white/70 mb-6">
              Can't find what you're looking for? Contact our support team and we'll help you out.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-lg">
                <Mail className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-white font-semibold">Email Support</p>
                  <p className="text-white/70 text-sm">support@cuet.ac.bd</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-lg">
                <Phone className="h-6 w-6 text-green-400" />
                <div>
                  <p className="text-white font-semibold">Phone Support</p>
                  <p className="text-white/70 text-sm">+880-31-714935</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Help;
