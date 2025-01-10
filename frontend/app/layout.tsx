import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from "next/font/google";
import { SessionProvider } from "@/context/Provider";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Embrace",
  description: "Therapeutic Chatbot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressContentEditableWarning suppressHydrationWarning className={raleway.className}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
