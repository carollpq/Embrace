import type { Metadata } from "next";
import "../../globals.css";
import { Quicksand } from "next/font/google";
import Navbar from "@/components/Navbar";
// import { Toaster } from "react-hot-toast";

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
      {/* <Toaster position="top-center" reverseOrder={false} /> */}
    </main>
  );
}
