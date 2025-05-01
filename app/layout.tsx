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
      <body suppressContentEditableWarning suppressHydrationWarning className={raleway.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
