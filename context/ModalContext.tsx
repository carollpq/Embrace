"use client";
import { createContext, useContext, useState, useCallback } from "react";

type ModalContextType = {
  showHelp: boolean;
  showConfirmExit: boolean;
  confirmedExit: boolean;
  showDisclaimer: boolean;
  showAbout: boolean;
  showSavedMessages: boolean;
  isLoggingOut: boolean;
  showTTSFallback: boolean;
  toggleHelp: (show?: boolean) => void;
  openExitConfirm: (callback: () => void) => void;
  closeExitConfirm: () => void;
  confirmExit: () => void;
  setConfirmedExit: (state: boolean) => void;
  toggleDisclaimer: (show?: boolean) => void;
  toggleAbout: (show?: boolean) => void;
  toggleSavedMessages: (show?: boolean) => void;
  setLoggingOut: (state: boolean) => void;
  triggerTTSFallback: () => void;
  closeTTSFallback: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [showHelp, setShowHelp] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);
  const [confirmedExit, setConfirmedExit] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSavedMessages, setShowSavedMessages] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [exitCallback, setExitCallback] = useState(() => () => {});
  const [showTTSFallback, setShowTTSFallback] = useState(false);

  const openExitConfirm = useCallback((callback: () => void) => {
    setExitCallback(() => callback);
    setShowConfirmExit(true);
  }, []);

  const closeExitConfirm = useCallback(() => {
    setShowConfirmExit(false);
  }, []);

  const confirmExit = useCallback(() => {
    setConfirmedExit(true);
    exitCallback();
  }, [exitCallback]);

  const triggerTTSFallback = () => setShowTTSFallback(true);
  const closeTTSFallback = () => setShowTTSFallback(false);

  return (
    <ModalContext.Provider
      value={{
        showHelp,
        showConfirmExit,
        confirmedExit,
        showDisclaimer,
        showAbout,
        showSavedMessages,
        isLoggingOut,
        openExitConfirm,
        closeExitConfirm,
        confirmExit,
        setConfirmedExit,
        toggleHelp: (show) => setShowHelp(show ?? !showHelp),
        toggleDisclaimer: (show) => setShowDisclaimer(show ?? !showDisclaimer),
        toggleAbout: (show) => setShowAbout(show ?? !showAbout),
        toggleSavedMessages: (show) =>
          setShowSavedMessages(show ?? !showSavedMessages),
        setLoggingOut: setIsLoggingOut,
        showTTSFallback,
        triggerTTSFallback,
        closeTTSFallback,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
