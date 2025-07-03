
import React from 'react';

export const AnimatedHero = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ocean wave simulation */}
      <div className="absolute bottom-0 left-0 w-full h-64">
        <svg
          className="absolute bottom-0 left-0 w-full h-full text-blue-400/20 dark:text-blue-600/20"
          viewBox="0 0 1200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C150,200 350,0 600,100 C850,200 1050,0 1200,100 L1200,200 L0,200 Z"
            fill="currentColor"
            className="opacity-30"
          >
            <animate
              attributeName="d"
              values="M0,100 C150,200 350,0 600,100 C850,200 1050,0 1200,100 L1200,200 L0,200 Z;
                      M0,120 C150,180 350,20 600,120 C850,180 1050,20 1200,120 L1200,200 L0,200 Z;
                      M0,100 C150,200 350,0 600,100 C850,200 1050,0 1200,100 L1200,200 L0,200 Z"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M0,120 C150,220 350,20 600,120 C850,220 1050,20 1200,120 L1200,200 L0,200 Z"
            fill="currentColor"
            className="opacity-20"
          >
            <animate
              attributeName="d"
              values="M0,120 C150,220 350,20 600,120 C850,220 1050,20 1200,120 L1200,200 L0,200 Z;
                      M0,140 C150,200 350,40 600,140 C850,200 1050,40 1200,140 L1200,200 L0,200 Z;
                      M0,120 C150,220 350,20 600,120 C850,220 1050,20 1200,120 L1200,200 L0,200 Z"
              dur="6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
      
      {/* Floating bubbles like water bubbles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
