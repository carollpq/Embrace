"use client";
import React from "react";

interface SliderSettingProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  description?: string;
}

const SliderSetting: React.FC<SliderSettingProps> = ({
  label,
  value,
  onChange,
  description,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full mt-4">
      <div className="flex flex-row justify-between sm:items-center gap-0">
        <label className="text-white font-medium text-sm sm:text-base">
          {label}
        </label>
        <span className="text-white/80 text-sm sm:text-md">
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      {description && (
        <p className="text-white/70 text-xs md:text-sm leading-snug sm:leading-normal">
          {description}
        </p>
      )}
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 sm:h-3 bg-gray-300 rounded-lg accent-blue-500 
             [&::-webkit-slider-thumb]:h-5 
             [&::-webkit-slider-thumb]:w-5 
             [&::-webkit-slider-thumb]:rounded-full 
             [&::-webkit-slider-thumb]:bg-blue-500 
             [&::-webkit-slider-thumb]:cursor-pointer
             [&::-moz-range-thumb]:h-5
             [&::-moz-range-thumb]:w-5
             [&::-moz-range-thumb]:rounded-full
             [&::-moz-range-thumb]:bg-blue-500
             [&::-moz-range-thumb]:cursor-pointer"
/>
    </div>
  );
};

export default SliderSetting;
