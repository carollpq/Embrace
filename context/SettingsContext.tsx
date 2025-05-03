"use client";
import { createContext, useContext } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AppSettings } from "@/types/context";

/**
 * Default application settings
 * - mode: Default chat mode (text/text, text/voice, etc.)
 * - persona: Default chatbot persona
 * - tts: Default text-to-speech engine
 * - nightMode: Dark/light theme toggle
 * - showSideBar: Sidebar visibility
 * - fontSize: Base font size for accessibility
 * - highContrast: High contrast mode for visually impaired users
 */
const defaultSettings: AppSettings = {
  mode: "text-and-text",
  persona: "Jenna",
  tts: "polly",
  nightMode: true,
  showSideBar: true,
  fontSize: "base",
  highContrast: false,
};

const SettingsContext = createContext<{
  settings: AppSettings;
  updateSettings: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;
} | null>(null);

export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Initialize all settings with localStorage persistence
  // Each setting has fallback to default value if localStorage fails
  const [mode, setMode] = useLocalStorage("mode", defaultSettings.mode);
  const [persona, setPersona] = useLocalStorage(
    "persona",
    defaultSettings.persona
  );
  const [tts, setTts] = useLocalStorage("tts", defaultSettings.tts);
  const [nightMode, setNightMode] = useLocalStorage(
    "nightMode",
    defaultSettings.nightMode
  );
  const [showSideBar, setShowSideBar] = useLocalStorage(
    "showSideBar",
    defaultSettings.showSideBar
  );
  const [fontSize, setFontSize] = useLocalStorage(
    "fontSize",
    defaultSettings.fontSize
  );
  const [highContrast, setHighContrast] = useLocalStorage(
    "highContrast",
    defaultSettings.highContrast
  );

  /**
   * Universal settings updater with error handling
   * @param key Setting key to update
   * @param value New value for the setting
   */
  const updateSettings = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    try {
      const setters = {
        mode: setMode,
        persona: setPersona,
        tts: setTts,
        nightMode: setNightMode,
        showSideBar: setShowSideBar,
        fontSize: setFontSize,
        highContrast: setHighContrast,
      };

      setters[key](value);

      // Special handling for visual changes
      if (key === "highContrast") {
        document.body.classList.toggle("high-contrast", value as boolean);
      }
    } catch (error) {
      console.error(`Failed to update setting ${key}:`, error);
      throw new Error(`Setting update failed: ${(error as Error).message}`);
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings: {
          mode: mode ?? defaultSettings.mode,
          persona: persona ?? defaultSettings.persona,
          tts: tts ?? defaultSettings.tts,
          nightMode: nightMode ?? defaultSettings.nightMode,
          showSideBar: showSideBar ?? defaultSettings.showSideBar,
          fontSize: fontSize ?? defaultSettings.fontSize,
          highContrast: highContrast ?? defaultSettings.highContrast,
        },
        updateSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context)
    throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
