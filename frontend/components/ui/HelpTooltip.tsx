
import React from "react";

interface HelpTooltipProps {
  text: string;
  position?: string; // e.g. "top-left", "bottom-right"
  className?: string;
}

const HelpTooltip = ({ text, className = "" }: HelpTooltipProps) => {
  return (
    <div
      className={`absolute z-90 bg-white text-black text-sm p-3 rounded-lg shadow-xl w-[12rem] animate-slideUp delay-1000 ${className}`}
    >
      {text}
    </div>
  );
};

export default HelpTooltip;
