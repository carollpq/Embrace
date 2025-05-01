'use client';
import { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AppSettings } from '@/types/context';

const defaultSettings: AppSettings = {
  mode: 'text-and-text',
  persona: 'Jenna',
  tts: 'polly',
  nightMode: true,
  showSideBar: true,
  fontSize: 'base',
  highContrast: false
};

const SettingsContext = createContext<{
  settings: AppSettings;
  updateSettings: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
} | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useLocalStorage('mode', defaultSettings.mode);
  const [persona, setPersona] = useLocalStorage('persona', defaultSettings.persona);
  const [tts, setTts] = useLocalStorage('tts', defaultSettings.tts);
  const [nightMode, setNightMode] = useLocalStorage('nightMode', defaultSettings.nightMode);
  const [showSideBar, setShowSideBar] = useLocalStorage('showSideBar', defaultSettings.showSideBar);
  const [fontSize, setFontSize] = useLocalStorage('fontSize', defaultSettings.fontSize);
  const [highContrast, setHighContrast] = useLocalStorage('highContrast', defaultSettings.highContrast);

  const updateSettings = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const setters = {
      mode: setMode,
      persona: setPersona,
      tts: setTts,
      nightMode: setNightMode,
      showSideBar: setShowSideBar,
      fontSize: setFontSize,
      highContrast: setHighContrast
    };
    setters[key](value);
  };

  return (
    <SettingsContext.Provider value={{
      settings: { mode, persona, tts, nightMode, showSideBar, fontSize, highContrast },
      updateSettings
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};