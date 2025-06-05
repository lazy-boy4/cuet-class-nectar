
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Scale, AlertTriangle, Users } from "lucide-react";

const Terms = () => {
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
            <FileText className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-white/80">
              Please read these terms carefully before using the CUET Class Management System.
            </p>
            <p className="text-white/60 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            
            {/* Acceptance */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-white/80">
                By accessing and using the CUET Class Management System, you agree to be bound 
                by these Terms of Service and all applicable laws and regulations. If you do 
                not agree with any of these terms, you are prohibited from using this system.
              </p>
            </div>

            {/* Eligibility */}
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">2. Eligibility and Access</h2>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Authorized Users</h3>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Current CUET students with valid student IDs</li>
                  <li>CUET faculty and staff members</li>
                  <li>Authorized university administrators</li>
                  <li>Approved Class Representatives (CRs)</li>
                </ul>
                <h3 className="text-lg font-semibold text-white">Account Requirements</h3>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Must use official CUET email address</li>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain confidentiality of login credentials</li>
                  <li>Notify administrators of any security breaches</li>
                </ul>
              </div>
            </div>

            {/* Acceptable Use */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">3. Acceptable Use Policy</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Permitted Activities</h3>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Access academic schedules and course information</li>
                  <li>View and manage attendance records</li>
                  <li>Enroll in authorized courses</li>
                  <li>Post and view academic notices (authorized users)</li>
                  <li>Update personal profile information</li>
                </ul>
                <h3 className="text-lg font-semibold text-white">Prohibited Activities</h3>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Unauthorized access to other users' accounts</li>
                  <li>Sharing login credentials with others</li>
                  <li>Attempting to hack or compromise system security</li>
                  <li>Posting inappropriate or offensive content</li>
                  <li>Using the system for commercial purposes</li>
                  <li>Interfering with system operations</li>
                </ul>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">4. User Responsibilities</h2>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Students</h3>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Maintain accurate enrollment and profile information</li>
                  <li>Follow proper enrollment procedures</li>
                  <li>Respect attendance policies and requirements</li>
                  <li>Use the system responsibly and ethically</li>
                </ul>
                <h3 className="text-lg font-semibold text-white">Faculty</h3>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Accurately record and manage attendance</li>
                  <li>Post relevant and appropriate notices</li>
                  <li>Maintain student privacy and confidentiality</li>
                  <li>Follow university academic policies</li>
                </ul>
                <h3 className="text-lg font-semibold text-white">Class Representatives</h3>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li>Review enrollment requests fairly and promptly</li>
                  <li>Communicate effectively with classmates</li>
                  <li>Assist with schedule management and updates</li>
                  <li>Report system issues to administrators</li>
                </ul>
              </div>
            </div>

            {/* Privacy and Data */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">5. Privacy and Data Protection</h2>
              <p className="text-white/80 mb-4">
                Your privacy is important to us. Please review our Privacy Policy for detailed 
                information about how we collect, use, and protect your personal information.
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Academic data is protected under university policies</li>
                <li>Personal information is secured using industry standards</li>
                <li>Data sharing is limited to authorized academic purposes</li>
                <li>Users can request access to their personal data</li>
              </ul>
            </div>

            {/* Intellectual Property */}
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">6. Intellectual Property</h2>
              </div>
              <p className="text-white/80 mb-4">
                The CUET Class Management System and all its content, features, and functionality 
                are owned by CUET and are protected by copyright, trademark, and other laws.
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Users may not copy, modify, or distribute system content</li>
                <li>CUET logo and branding are protected trademarks</li>
                <li>Academic content remains property of respective owners</li>
                <li>User-generated content is subject to university policies</li>
              </ul>
            </div>

            {/* System Availability */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">7. System Availability</h2>
              <p className="text-white/80 mb-4">
                While we strive to maintain continuous system availability, we cannot guarantee 
                uninterrupted service. The system may be temporarily unavailable for:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Scheduled maintenance and updates</li>
                <li>Emergency repairs and security patches</li>
                <li>Network or server issues beyond our control</li>
                <li>Force majeure events</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">8. Limitation of Liability</h2>
              </div>
              <p className="text-white/80">
                CUET and its affiliates shall not be liable for any direct, indirect, incidental, 
                special, or consequential damages resulting from the use or inability to use this 
                system. This includes but is not limited to data loss, academic consequences, or 
                system downtime. Users are responsible for maintaining backup records of important 
                academic information.
              </p>
            </div>

            {/* Modifications */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">9. Modifications to Terms</h2>
              <p className="text-white/80">
                CUET reserves the right to modify these terms at any time. Users will be notified 
                of significant changes through the system notification board or email. Continued 
                use of the system after modifications constitutes acceptance of the updated terms.
              </p>
            </div>

            {/* Termination */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">10. Account Termination</h2>
              <p className="text-white/80 mb-4">
                Accounts may be suspended or terminated for:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Violation of these terms of service</li>
                <li>Misuse of system resources or features</li>
                <li>Graduation or separation from CUET</li>
                <li>Extended inactivity periods</li>
                <li>Administrative or security reasons</li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">11. Contact Information</h2>
              <p className="text-white/80 mb-4">
                For questions about these Terms of Service, please contact:
              </p>
              <div className="space-y-2 text-white/80">
                <p><strong>Email:</strong> support@cuet.ac.bd</p>
                <p><strong>Phone:</strong> +880-31-714935</p>
                <p><strong>Address:</strong> CUET, Chittagong-4349, Bangladesh</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Terms;
