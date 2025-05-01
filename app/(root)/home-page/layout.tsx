import type { Metadata } from "next";
import "../../globals.css";
import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";

const quicksand = Quicksand({ weight: ["400"], subsets: ["latin"] });

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
    <main className={quicksand.className}>
      <Navbar />
      {children}
    </main>
  );
}
