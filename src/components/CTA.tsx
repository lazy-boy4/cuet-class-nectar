
import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { NeuButton } from "@/components/ui/neu-button";

const CTA = () => {
  useEffect(() => {
    const revealElement = document.querySelector("#cta .reveal");
    if (revealElement) {
      setTimeout(() => {
        revealElement.classList.add("active");
      }, 100);
    }
  }, []);

  return (
    <section id="cta" className="relative py-24 sm:py-32 bg-background overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 hero-mesh opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="reveal mx-auto max-w-3xl">
          {/* CTA Card */}
          <div className="rounded-2xl bg-card p-8 md:p-12 text-center shadow-neu-raised border border-white/[0.06]">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-info/20 via-transparent to-icon-purple/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
            
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl tracking-tight">
              Ready to enhance your
              <span className="block gradient-platinum">CUET experience?</span>
            </h2>
            
            <p className="mb-8 text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of students and faculty already using our platform
              to streamline their academic journey.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <NeuButton variant="primary" size="lg" className="group">
                  <span>Sign Up Now</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </NeuButton>
              </Link>
              <Link to="/login">
                <NeuButton variant="outline" size="lg">
                  Already a member? Log In
                </NeuButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
