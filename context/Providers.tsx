'use client';
import { SessionProvider } from './SessionContext';
import { SettingsProvider } from './SettingsContext';
import { ChatProvider } from './ChatContext';
import { ModalProvider } from './ModalContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SettingsProvider>
        <ChatProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </ChatProvider>
      </SettingsProvider>
    </SessionProvider>
  );
}