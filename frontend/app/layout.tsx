import type { Metadata } from "next";
import "./globals.css";
import { Raleway } from "next/font/google";
import AuthProvider from "@/context/Provider";

const raleway = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Embrace",
  description: "Therapeutic Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
      suppressContentEditableWarning
      suppressHydrationWarning
      className={raleway.className}>
      <AuthProvider>
        {children}
      </AuthProvider>
      </body>
    </html>
  );
}
