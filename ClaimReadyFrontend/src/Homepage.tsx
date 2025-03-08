import React, { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";

const Homepage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTracking, setStartTracking] = useState(false);

  const SCROLL_THRESHOLD = 600; // Hardcoded value (Spline's height)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > SCROLL_THRESHOLD) {
        setStartTracking(true);
        setScrollY(window.scrollY - SCROLL_THRESHOLD); // Normalize scroll
        const newIndex = Math.floor((window.scrollY - SCROLL_THRESHOLD) / 300);
        setCurrentIndex(newIndex);
      } else {
        setStartTracking(false);
        setScrollY(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-screen h-screen bg-background">
      {/* Spline 3D Scene */}
      <Spline
        scene="https://prod.spline.design/VMVgTOkbPJRNTowR/scene.splinecode"
      />

      {/* Parallax Scrolling Section */}
      <section className="relative h-[1300px] flex items-center bg-background">
        {/* Transparent cards for the text */}
        <div
          className="absolute left-0 top-1/4 w-1/2 bg-opacity-50 backdrop-blur-lg p-6 rounded-xl"
          style={{
            opacity: startTracking ? 1 : 0,
            transition: "opacity 0.8s ease-in-out",
            transform: `translateY(${startTracking ? scrollY * 0.3 : 0}px)`,
          }}
        >
          {/* Text Cards (Editable Content) */}
          {currentIndex === 0 && (
            <>
              <h2 className="text-5xl font-bold text-black">
                Scan.
              </h2>
              <p className="text-lg text-black mt-4">
                Upload images, and let AI catalog your lost belongings.
              </p>
            </>
          )}
          {currentIndex === 1 && (
            <>
              <h2 className="text-5xl font-bold text-black">
                Value.
              </h2>
              <p className="text-lg text-black mt-4">
                Instantly retrieve item prices for accurate insurance claims.
              </p>
            </>
          )}
          {currentIndex === 2 && (
            <>
              <h2 className="text-5xl font-bold text-black">
                Protect.
              </h2>
              <p className="text-lg text-black mt-4">
                Ensure smooth and verified claims for a faster recovery.
              </p>
            </>
          )}
        </div>

        {/* Conditionally render the Spline on the right when "Scan" is visible */}
        {currentIndex === 0 && (
          <div
            className="absolute right-0 top-0 w-1/2 h-full"
            style={{
              transition: "transform 0.8s ease-in-out",
              transform: `translateY(${startTracking ? scrollY * 0.3 : 0}px)`,
            }}
          >
            <Spline
              scene="https://prod.spline.design/wDWKL3kVWBwM0Am1/scene.splinecode"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default Homepage;