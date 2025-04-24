
import { useEffect } from "react";

export const useScrollAnimation = () => {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      
      if (reveals.length === 0) return;
      
      const windowHeight = window.innerHeight;
      const elementVisible = 150;
      
      reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active");
        } else {
          // Uncomment the following line if you want elements to hide when scrolled out of view
          // element.classList.remove("active");
        }
      });
    };
    
    // Run once immediately after component mounts with a delay to ensure DOM is ready
    const initialTimeout = setTimeout(() => {
      handleScroll();
    }, 300);
    
    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Call it once more after a longer delay to catch any lazy-loaded elements
    const secondTimeout = setTimeout(() => {
      handleScroll();
    }, 1000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(initialTimeout);
      clearTimeout(secondTimeout);
    };
  }, []);
};
