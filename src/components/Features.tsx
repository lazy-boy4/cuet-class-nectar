
import React from "react";
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Bell, 
  CheckSquare, 
  Shield,
  Smartphone,
  BarChart
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Course Management",
    description: "Easily manage courses, syllabi, and learning materials in one centralized platform.",
  },
  {
    icon: Users,
    title: "Class Organization",
    description: "Organize classes by department, batch, and section with intuitive controls.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Create and manage class schedules with conflict detection and optimization.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Keep everyone informed with real-time announcements and updates.",
  },
  {
    icon: CheckSquare,
    title: "Attendance Tracking",
    description: "Track attendance effortlessly with digital check-ins and detailed reports.",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Secure access control for students, teachers, and administrators.",
  },
  {
    icon: Smartphone,
    title: "Mobile Responsive",
    description: "Access the platform seamlessly from any device, anywhere, anytime.",
  },
  {
    icon: BarChart,
    title: "Analytics Dashboard",
    description: "Gain insights with comprehensive analytics and performance metrics.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <h2 className="section-heading">
            Powerful Features
          </h2>
          <p className="section-subheading mx-auto">
            Everything you need to streamline academic management, designed with
            precision and elegance.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <NeuCard
              key={feature.title}
              variant="raised"
              hover
              className="reveal p-6"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <NeuCardContent className="p-0">
                {/* Icon container with inset shadow */}
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-luxe-black shadow-neu-inset">
                  <feature.icon className="h-6 w-6 text-info" />
                </div>
                
                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </NeuCardContent>
            </NeuCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
