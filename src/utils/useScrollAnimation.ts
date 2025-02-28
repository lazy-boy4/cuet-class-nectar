
import { useEffect } from "react";

export const useScrollAnimation = () => {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      
      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active");
        }
      });
    };
    
    // Run once immediately
    setTimeout(handleScroll, 100);
    
    // Then add scroll listener
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
};
