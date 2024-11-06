import type { Metadata } from "next";
import "../../globals.css";
import { Quicksand } from "next/font/google";
import ChatHeader from "@/components/ui/ChatHeader";
import Sidebar from "@/components/ui/Sidebar";

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
    <html lang="en">
      <body className={`${quicksand.className} bg-home-screen-blue bg-black/40 flex flex-row h-screen w-screen justify-between`}>
        <Sidebar />
        <div className="flex flex-col w-full h-screen">
          <ChatHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
