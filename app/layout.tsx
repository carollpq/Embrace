import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from "next/font/google";
import { Providers } from "@/context/Providers";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Embrace",
  description: "Therapeutic Chatbot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 
        suppressContentEditableWarning: Prevents warnings about contentEditable
        suppressHydrationWarning: Prevents Next.js hydration mismatch warnings
        className: Applies Raleway font to entire app
      */}
      <body suppressContentEditableWarning suppressHydrationWarning className={raleway.className}>
        {/* 
          Providers: Wraps app with all context providers 
          (Session, Settings, Modal, etc.)
        */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
