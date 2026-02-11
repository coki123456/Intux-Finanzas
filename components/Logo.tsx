import React from 'react';

export const Logo: React.FC<{ className?: string; textClassName?: string; showText?: boolean }> = ({ 
  className = "h-8 w-8", 
  textClassName = "text-xl",
  showText = true 
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={className}
      >
        {/* Abstract Geometric Shapes mimicking the provided logo */}
        {/* Top Right */}
        <path d="M55 5 H95 V45 A40 40 0 0 1 55 5 Z" fill="currentColor" />
        {/* Middle Left */}
        <path d="M5 30 H45 V70 A40 40 0 0 1 5 30 Z" fill="currentColor" />
        {/* Middle Right */}
        <path d="M55 55 H95 V95 A40 40 0 0 1 55 55 Z" fill="currentColor" />
        {/* Bottom Left */}
        <path d="M5 80 H45 V95 H5 V80 Z" fill="currentColor" /> 
        {/* Note: The bottom left in some versions is a quarter circle, 
            in others it looks like the start of one. 
            I'll use a quarter circle for symmetry based on the 'F' pattern logic 
        */}
        <path d="M5 55 H45 V95 A40 40 0 0 1 5 55 Z" fill="currentColor" />
      </svg>
      {showText && (
        <span className={`font-bold tracking-tight ${textClassName}`}>
          Intux
        </span>
      )}
    </div>
  );
};