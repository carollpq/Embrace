// components/ui/TooltipWrapper.tsx
"use client";
import React, { useRef, useEffect, useState } from "react";
import HelpTooltip from "./HelpTooltip";

interface TooltipWrapperProps {
  children: React.ReactNode;
  tooltipText: string;
  showTooltip: boolean;
  placement?: "right" | "left" | "top" | "bottom";
}

const TooltipWrapper = ({
  children,
  tooltipText,
  showTooltip,
  placement = "right",
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
          left = rect.right + scrollLeft + 10;
          top = rect.top + scrollTop;
          break;
        case "left":
          left = rect.left + scrollLeft - 210; // assuming tooltip width ~200
          top = rect.top + scrollTop;
          break;
        case "top":
          top = rect.top + scrollTop - 50;
          left = rect.left + scrollLeft;
          break;
        case "bottom":
          top = rect.bottom + scrollTop + 10;
          left = rect.left + scrollLeft;
          break;
      }

      setTooltipPos({ top, left });
    }
  }, [showTooltip, placement]);

  return (
    <div ref={targetRef} style={{ position: "relative", display: "inline-block" }}>
      {children}
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltipPos.top,
            left: tooltipPos.left,
            zIndex: 100,
          }}
        >
          <HelpTooltip text={tooltipText} />
        </div>
      )}
    </div>
  );
};

export default TooltipWrapper;
