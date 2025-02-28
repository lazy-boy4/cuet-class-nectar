
import React from "react";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-cuet-dark py-24 sm:py-32"
    >
      <div className="container mx-auto px-4">
        <div
          className="reveal mx-auto max-w-3xl rounded-2xl border border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 text-center backdrop-blur-sm md:p-12"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to enhance your CUET experience?
          </h2>
          <p className="mb-8 text-lg text-white/70">
            Join thousands of students and faculty already using our platform to streamline their academic journey.
          </p>
          <a
            href="/signup"
            className="group inline-flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-3 text-white transition-all duration-300 hover:shadow-lg"
          >
            <span>Sign Up Now</span>
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTA;
