
import React, { useEffect, useRef } from "react";
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Bell,
  Users,
  Clock,
  MessageSquare,
  BarChart
} from "lucide-react";

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`reveal feature-card ${delay}`}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20 text-blue-500">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  );
};

const Features = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    if (subtitleRef.current) observer.observe(subtitleRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (subtitleRef.current) observer.unobserve(subtitleRef.current);
    };
  }, []);

  const features = [
    {
      icon: <BookOpen size={24} />,
      title: "Easy Class Enrollment",
      description: "Streamlined registration process with unique codes for each class.",
      delay: "delay-100",
    },
    {
      icon: <Calendar size={24} />,
      title: "Real-time Attendance",
      description: "Track and monitor class participation effortlessly with digital attendance.",
      delay: "delay-200",
    },
    {
      icon: <FileText size={24} />,
      title: "Digital Schedules",
      description: "Instantly access timetables parsed from PDF uploads.",
      delay: "delay-300",
    },
    {
      icon: <Bell size={24} />,
      title: "Notice Board",
      description: "Stay informed with important university announcements and updates.",
      delay: "delay-400",
    },
    {
      icon: <Users size={24} />,
      title: "Team Collaboration",
      description: "Work together on projects with integrated group features.",
      delay: "delay-100",
    },
    {
      icon: <Clock size={24} />,
      title: "Deadline Reminders",
      description: "Never miss important submission dates with smart notifications.",
      delay: "delay-200",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "Discussion Forums",
      description: "Engage in course-related discussions with peers and faculty.",
      delay: "delay-300",
    },
    {
      icon: <BarChart size={24} />,
      title: "Performance Analytics",
      description: "Track academic progress with detailed visual reports and insights.",
      delay: "delay-400",
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-gradient-to-b from-cuet-navy to-cuet-navy/90 py-24 sm:py-32"
    >
      <div className="container mx-auto px-4">
        <h2
          ref={titleRef}
          className="reveal section-heading text-center"
        >
          CUET Class Management System Features
        </h2>
        <p
          ref={subtitleRef}
          className="reveal section-subheading mx-auto text-center"
        >
          Our system simplifies class management for students, teachers, and administrators at CUET.
        </p>

        <div className="mx-auto mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
