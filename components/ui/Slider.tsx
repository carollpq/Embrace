"use client";
import React from "react";

interface SliderSettingProps {
  label: string;
  value: number;
  onChange: (newValue: number) => void;
  description?: string;
}

const SliderSetting: React.FC<SliderSettingProps> = ({ label, value, onChange, description }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center">
        <label className="text-white font-medium">{label}</label>
        <span className="text-white/80 text-md">{(value * 100).toFixed(0)}%</span>
      </div>
      {description && <p className="text-md text-white/70">{description}</p>}
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-500 hover:cursor-pointer"
      />
    </div>
  );
};

export default SliderSetting;
