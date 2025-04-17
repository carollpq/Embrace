// components/ui/TooltipWrapper.tsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import HelpTooltip from "./HelpTooltip";

interface TooltipWrapperProps {
  children: React.ReactNode;
  tooltipText: string;
  showTooltip: boolean;
  placement?: "right" | "left" | "top" | "bottom";
  className?: string;
}

const TooltipWrapper = ({
  children,
  tooltipText,
  showTooltip,
  placement = "right",
  className = "",
}: TooltipWrapperProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (showTooltip && targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const scrollLeft = window.scrollX;

      let top = rect.top + scrollTop;
      let left = rect.left + scrollLeft;

      switch (placement) {
        case "right":
          left = rect.right + scrollLeft;
          top = rect.top + scrollTop;
          break;
        case "left":
          left = rect.left + scrollLeft; // assuming tooltip width ~200
          top = rect.top + scrollTop;
          break;
        case "top":
          top = rect.top + scrollTop;
          left = rect.left + scrollLeft;
          break;
        case "bottom":
          top = rect.bottom + scrollTop;
          left = rect.left + scrollLeft;
          break;
      }

      setTooltipPos({ top, left });
    }
  }, [showTooltip, placement]);

  return (
    <div ref={targetRef} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {children}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltipPos.top,
            left: tooltipPos.left,
            margin: "1rem"
          }}
        >
          <HelpTooltip text={tooltipText} className={className}/>
        </div>
      )}
    </div>
  );
};

export default TooltipWrapper;
