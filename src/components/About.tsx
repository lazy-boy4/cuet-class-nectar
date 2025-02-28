
import React, { useEffect, useRef } from "react";

const About = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

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
    if (contentRef.current) observer.observe(contentRef.current);
    if (imagesRef.current) observer.observe(imagesRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (contentRef.current) observer.unobserve(contentRef.current);
      if (imagesRef.current) observer.unobserve(imagesRef.current);
    };
  }, []);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "CUET Campus",
    },
    {
      url: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "CUET Library",
    },
    {
      url: "https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "CUET Building",
    },
  ];

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-cuet-navy py-24 sm:py-32"
    >
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <h2
          ref={titleRef}
          className="reveal section-heading text-center"
        >
          About Chittagong University of Engineering and Technology
        </h2>

        <div className="mx-auto grid max-w-screen-xl gap-8 lg:grid-cols-2">
          <div
            ref={contentRef}
            className="reveal flex flex-col justify-center space-y-6"
          >
            <p className="text-lg leading-relaxed text-white/80">
              Founded in 1968, CUET is a premier engineering university in
              Bangladesh, located in Chittagong. With 12 departments and over
              5,000 students, CUET is committed to excellence in engineering
              education and research.
            </p>
            <p className="text-lg leading-relaxed text-white/80">
              Our mission is to provide quality education, fostering innovation
              and research, with a vision to be a world-class institution. We
              emphasize practical learning, research opportunities, and
              industry-academia collaboration.
            </p>
            <p className="text-lg leading-relaxed text-white/80">
              CUET continues to evolve with modern educational tools like our
              Class Management System, enhancing the learning experience for
              everyone in our community.
            </p>
          </div>

          <div
            ref={imagesRef}
            className="reveal grid grid-cols-2 gap-4"
          >
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={images[0].url}
                  alt={images[0].alt}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden rounded-lg">
                <img
                  src={images[1].url}
                  alt={images[1].alt}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="grid">
              <div className="overflow-hidden rounded-lg">
                <img
                  src={images[2].url}
                  alt={images[2].alt}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
