
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";

const Privacy = () => {
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
            <Shield className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-white/80">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-white/60 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Privacy Content */}
          <div className="space-y-8">
            
            {/* Introduction */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="text-white/80">
                Chittagong University of Engineering & Technology (CUET) Class Management System 
                is committed to protecting your privacy and ensuring the security of your personal 
                information. This Privacy Policy explains how we collect, use, store, and protect 
                your information when you use our platform.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-6 w-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1">
                    <li>Full name and CUET student/faculty ID</li>
                    <li>Official CUET email address</li>
                    <li>Department and academic batch information</li>
                    <li>Profile picture (optional)</li>
                    <li>Class section and enrollment data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Academic Information</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1">
                    <li>Class attendance records</li>
                    <li>Course enrollment history</li>
                    <li>Academic schedules and timetables</li>
                    <li>Notice board interactions</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Technical Information</h3>
                  <ul className="list-disc list-inside text-white/80 space-y-1">
                    <li>Device information and browser type</li>
                    <li>IP address and location data</li>
                    <li>Login timestamps and session data</li>
                    <li>System usage analytics</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
              </div>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Provide and maintain the class management system</li>
                <li>Process enrollment requests and manage class rosters</li>
                <li>Track attendance and generate academic reports</li>
                <li>Send important notifications and announcements</li>
                <li>Ensure system security and prevent unauthorized access</li>
                <li>Improve system functionality and user experience</li>
                <li>Comply with university policies and legal requirements</li>
              </ul>
            </div>

            {/* Data Protection */}
            <div className="glass-card p-8">
              <div className="flex items-center space-x-3 mb-4">
                <Lock className="h-6 w-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Data Protection & Security</h2>
              </div>
              <div className="space-y-4">
                <p className="text-white/80">
                  We implement industry-standard security measures to protect your information:
                </p>
                <ul className="list-disc list-inside text-white/80 space-y-2">
                  <li><strong>Encryption:</strong> All data transmission is encrypted using HTTPS/TLS</li>
                  <li><strong>Authentication:</strong> Secure JWT-based authentication system</li>
                  <li><strong>Access Control:</strong> Role-based access restrictions</li>
                  <li><strong>Data Storage:</strong> Secure cloud database with regular backups</li>
                  <li><strong>Monitoring:</strong> Continuous monitoring for security threats</li>
                  <li><strong>Updates:</strong> Regular security updates and patches</li>
                </ul>
              </div>
            </div>

            {/* Information Sharing */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <p className="text-white/80 mb-4">
                We do not sell, trade, or rent your personal information to third parties. 
                Information may be shared only in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Within the university for academic and administrative purposes</li>
                <li>With authorized faculty and staff for educational activities</li>
                <li>When required by law or university regulations</li>
                <li>To protect the rights and safety of users and the university</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <p className="text-white/80 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate data</li>
                <li>Update your profile and preferences</li>
                <li>Request data deletion (subject to university retention policies)</li>
                <li>Opt-out of non-essential communications</li>
                <li>File complaints about privacy practices</li>
              </ul>
            </div>

            {/* Data Retention */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
              <p className="text-white/80">
                We retain your information for as long as necessary to provide services and 
                comply with university policies. Academic records may be retained permanently 
                for institutional purposes. Personal information may be deleted upon graduation 
                or separation from the university, subject to legal and policy requirements.
              </p>
            </div>

            {/* Contact */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-white/80 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact:
              </p>
              <div className="space-y-2 text-white/80">
                <p><strong>Email:</strong> privacy@cuet.ac.bd</p>
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

export default Privacy;
