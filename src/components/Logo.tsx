import React from "react";

export const Logo: React.FC<{
  className?: string;
  textClassName?: string;
  showText?: boolean;
}> = ({
  className = "h-8 w-8",
  textClassName = "text-xl",
  showText = true,
}) => {
  return (
    <div className="flex items-center gap-3 select-none">
      <svg
        viewBox="0 0 100 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Intux Logo - Corrected Geometry */}
        {/* Top Right (Row 1) */}
        <path d="M50 0 H90 V40 A40 40 0 0 1 50 0 Z" fill="currentColor" />
        {/* Middle Left (Row 2) */}
        <path d="M0 50 H40 A40 40 0 0 1 0 90 V50 Z" fill="currentColor" />
        {/* Middle Right (Row 2) */}
        <path d="M90 50 V90 H50 A40 40 0 0 1 90 50 Z" fill="currentColor" />
        {/* Bottom Left (Row 3) */}
        <path d="M0 100 V140 H40 A40 40 0 0 1 0 100 Z" fill="currentColor" />
      </svg>
      {showText && (
        <span className={`font-bold tracking-tight ${textClassName}`}>
          Intux
        </span>
      )}
    </div>
  );
};
