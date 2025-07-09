"use client";

import { useEffect, useRef, useState } from "react";

interface NetflixLogoAnimationProps {
  onAnimationComplete: () => void;
}

const NetflixLogoAnimation = ({
  onAnimationComplete,
}: NetflixLogoAnimationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onAnimationComplete, 500);
    }, 4000);

    return () => clearTimeout(fallbackTimeout);
  }, [onAnimationComplete]);

  const handleVideoEnd = () => {
    setIsVisible(false);
    setTimeout(onAnimationComplete, 500);
  };

  return (
    <div
      className={`fixed inset-0 bg-black flex items-center justify-center z-50 transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <video
        ref={videoRef}
        src="/netflix-intro.mp4"
        autoPlay
        playsInline
        onEnded={handleVideoEnd}
        onError={handleVideoEnd}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default NetflixLogoAnimation;
