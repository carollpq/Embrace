"use client";
import { SessionProvider } from "./SessionContext";
import { SettingsProvider } from "./SettingsContext";
import { ChatProvider } from "./ChatContext";
import { ModalProvider } from "./ModalContext";
import { OnboardingProvider } from "./OnboardingContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <ChatProvider>
          <ModalProvider>
            <OnboardingProvider>{children}</OnboardingProvider>
          </ModalProvider>
        </ChatProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}
