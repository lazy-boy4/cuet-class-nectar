
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQ = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      category: "Account & Authentication",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Go to the signup page and choose either Student or Teacher registration. For students, you'll need your CUET ID (e.g., 2309026), full name, official CUET email (e.g., u2309026@student.cuet.ac.bd), department, and batch information. Teachers need their full name, faculty email, and department."
        },
        {
          question: "I forgot my password. How can I reset it?",
          answer: "Click 'Forgot Password' on the login page, enter your CUET email address, and follow the instructions sent to your email. Make sure to check your spam folder if you don't see the reset email within a few minutes."
        },
        {
          question: "Why can't I log in with my email?",
          answer: "Ensure you're using your official CUET email address. Students must use emails in the format u[studentID]@student.cuet.ac.bd, and faculty must use their @cuet.ac.bd email addresses. Also verify that your account has been activated."
        },
        {
          question: "Can I change my email address?",
          answer: "Email addresses cannot be changed as they are tied to your CUET identity. If there's an error, contact the system administrator for assistance."
        }
      ]
    },
    {
      category: "Class Management",
      questions: [
        {
          question: "How do I enroll in a class?",
          answer: "Navigate to the 'Enroll' section in your student dashboard, browse available classes, and submit an enrollment request. Your request will need approval from the Class Representative (CR) of that class."
        },
        {
          question: "Who approves my enrollment requests?",
          answer: "Class Representatives (CRs) have the authority to approve or deny enrollment requests for their respective classes. CRs are students who have been promoted to this role by system administrators."
        },
        {
          question: "How can I check my class schedule?",
          answer: "Your class schedule is available in your dashboard under the 'Classes' section. You can view schedules for all enrolled classes, including times, locations, and any updates posted by teachers or CRs."
        },
        {
          question: "What if my class schedule changes?",
          answer: "Teachers and CRs can update schedules and post announcements about changes. You'll receive notifications about schedule updates, and the changes will be reflected in your dashboard immediately."
        }
      ]
    },
    {
      category: "Attendance",
      questions: [
        {
          question: "How is attendance tracked?",
          answer: "Teachers mark attendance for each class session. You can view your attendance records in your dashboard with detailed breakdowns by course, showing total classes, attended classes, and attendance percentage."
        },
        {
          question: "Can I see my attendance statistics?",
          answer: "Yes! Your student dashboard includes an attendance tracker with pie charts showing overall attendance and bar graphs for individual courses. You can see both semester-wide and course-specific statistics."
        },
        {
          question: "What if my attendance is marked incorrectly?",
          answer: "Contact your course teacher directly to discuss attendance discrepancies. Teachers have the ability to modify attendance records if there are errors."
        },
        {
          question: "Is there a minimum attendance requirement?",
          answer: "Attendance requirements follow CUET's academic policies. Check with your department or course teacher for specific requirements for each course."
        }
      ]
    },
    {
      category: "Class Representatives (CRs)",
      questions: [
        {
          question: "How do I become a Class Representative?",
          answer: "CRs are promoted by system administrators. Speak with your department head or course coordinator about the selection process, or contact system support for information about CR promotion procedures."
        },
        {
          question: "What can CRs do in the system?",
          answer: "CRs can approve enrollment requests, upload PDF schedules, set test dates, post class notices, and help manage class-specific information. They serve as liaisons between students and faculty."
        },
        {
          question: "Can CRs modify attendance?",
          answer: "No, only teachers can mark and modify attendance records. CRs focus on enrollment management and communication within their classes."
        },
        {
          question: "How long does CR status last?",
          answer: "CR status typically lasts for the academic year or as determined by university policy. Contact administrators for specific details about your CR term."
        }
      ]
    },
    {
      category: "Notice Board & Communication",
      questions: [
        {
          question: "How do I view notices?",
          answer: "The Notice Board is accessible from the main navigation menu. You'll see both global university notices and class-specific announcements. Important notices also appear in your dashboard."
        },
        {
          question: "Who can post notices?",
          answer: "Teachers can post notices for their classes, CRs can post class-specific announcements, and administrators can post global notices visible to all users."
        },
        {
          question: "Will I get notified about new announcements?",
          answer: "Yes, the system sends notifications for important notices. You can manage your notification preferences in your profile settings."
        },
        {
          question: "Can I post notices as a student?",
          answer: "Regular students cannot post notices. Only teachers, CRs, and administrators have posting privileges. If you need to communicate something to your class, contact your CR or teacher."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          question: "The system is running slowly. What should I do?",
          answer: "Try refreshing your browser, clearing your cache, or switching to a different browser. If the issue persists, it might be a server-side issue. Contact support if problems continue."
        },
        {
          question: "I'm getting error messages. How can I fix this?",
          answer: "Note the exact error message and try refreshing the page. If the error persists, contact support with details about what you were trying to do when the error occurred."
        },
        {
          question: "Can I use the system on my mobile phone?",
          answer: "Yes, the system is fully responsive and works on mobile devices. You can access all features through your mobile browser."
        },
        {
          question: "Which browsers are supported?",
          answer: "The system works best with modern browsers like Chrome, Firefox, Safari, and Edge. Make sure your browser is updated to the latest version for optimal performance."
        }
      ]
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
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Find quick answers to the most common questions about the CUET Class Management System.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="glass-card p-6">
                <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/20 pb-3">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const globalIndex = categoryIndex * 100 + questionIndex;
                    const isExpanded = expandedItems.includes(globalIndex);
                    
                    return (
                      <div key={questionIndex} className="border border-white/10 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleItem(globalIndex)}
                          className="w-full px-6 py-4 text-left bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                        >
                          <span className="text-white font-medium">{faq.question}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-white/70 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-white/70 flex-shrink-0" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="px-6 py-4 bg-white/5">
                            <p className="text-white/80 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Support */}
          <div className="mt-12 glass-card p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Still Have Questions?
            </h2>
            <p className="text-white/70 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/help"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Visit Help Center
              </Link>
              <Link
                to="/support"
                className="border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
