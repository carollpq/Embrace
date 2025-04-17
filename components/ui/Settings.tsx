import React from "react";
import { useSession } from "@/context/Provider";

const Settings = () => {
    const { nightMode, setNightMode, fontSize, setFontSize, highContrast, setHighContrast } = useSession();
  return (
    <div className="flex flex-col gap-3 bg-white/10 p-4 rounded-lg">
      {/* Dark/Light Mode */}
      <div className="flex justify-between items-center">
        <span>Night Mode</span>
        <input
          type="checkbox"
          checked={nightMode}
          onChange={() => setNightMode(!nightMode)}
          className="w-5 h-5 hover:cursor-pointer"
        />
      </div>

      {/* Font Size */}
      <div className="flex justify-between items-center">
        <span>Font Size</span>
        <select
          value={fontSize ?? "base"}
          onChange={(e) => setFontSize(e.target.value)}
          className="bg-transparent border rounded px-2 py-1 hover:cursor-pointer"
        >
          <option value="sm" className="text-black">Small</option>
          <option value="base" className="text-black">Medium</option>
          <option value="lg" className="text-black">Large</option>
          <option value="xl" className="text-black">Extra Large</option>
        </select>
      </div>

      {/* High Contrast */}
      <div className="flex justify-between items-center">
        <span>High Contrast</span>
        <input
          type="checkbox"
          checked={highContrast ?? false}
          onChange={() => setHighContrast(!highContrast)}
          className="w-5 h-5 hover:cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Settings;
