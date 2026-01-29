
import React from "react";
import { NeuCard, NeuCardContent } from "@/components/ui/neu-card";
import { GraduationCap, Target, Sparkles } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="reveal">
            <div className="inline-flex items-center rounded-full bg-card px-4 py-1.5 border border-white/[0.08] shadow-neu-raised-sm mb-6">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                About CUET CMS
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl tracking-tight mb-6">
              Transforming Education
              <span className="block text-muted-foreground font-normal text-2xl md:text-3xl mt-2">
                One Click at a Time
              </span>
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              CUET Class Management System is designed to streamline the academic
              experience for students, teachers, and administrators at Chittagong
              University of Engineering and Technology. Our platform brings
              together modern technology and intuitive design to make education
              management effortless.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "99%", label: "Uptime" },
                { value: "50ms", label: "Response Time" },
                { value: "24/7", label: "Support" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6 reveal">
            {[
              {
                icon: GraduationCap,
                title: "Academic Excellence",
                description:
                  "Empowering students and faculty with tools designed for success in their academic journey.",
              },
              {
                icon: Target,
                title: "Focused Design",
                description:
                  "Every feature is purposefully crafted to enhance productivity without unnecessary complexity.",
              },
              {
                icon: Sparkles,
                title: "Modern Experience",
                description:
                  "A premium, intuitive interface that makes academic management feel effortless.",
              },
            ].map(({ icon: Icon, title, description }, idx) => (
              <NeuCard
                key={title}
                variant="raised"
                hover
                className="p-6"
              >
                <NeuCardContent className="p-0 flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-luxe-black shadow-neu-inset">
                    <Icon className="h-6 w-6 text-info" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </NeuCardContent>
              </NeuCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
