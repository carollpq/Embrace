import React, { useState } from "react";
import { useModal } from "@/context/ModalContext";
import Image from "next/image";

const helpPages = [
  {
    title: "Back to Home",
    content:
      "If you want to log out, leave the chat session and go back to the home page, simply click on the logo in the sidebar. Note: your chat sessions will NOT be saved.",
    image: "/img/click-to-home.jpg",
    alt: "Back to Home",
  },
  {
    title: "Change Your Chat Mode",
    content:
      "Select whether you prefer text, voice, or both for your conversation.",
    image: "/img/switch-modes.png",
    alt: "Conversation Modes",
  },
  {
    title: "Change the Persona",
    content:
      "If you feel like talking to a different persona, simply click on this button on the chat header and switch the persona!",
    image: "/img/switch-persona.png",
    alt: "Switch to a Different Persona",
  },
  {
    title: "Customize Your Experience",
    content:
      "Similarly, you can adjust how the persona responds — from tone to energy to support style. Simply click on 'customize personality' whenever you want.",
    image: "/img/customize-traits.png",
    alt: "Switch to a Different Persona",
  },
  {
    title: "Switch to Online/Offline Text to Speech",
    content:
      "In voice modes, you can toggle between online mode (slower but more realistic) or offline mode (sounds more robotic but instant)",
    image: "/img/switch-voice-mode.png",
    alt: "TTS Mode",
  },
  {
    title: "Tap to Start/Stop Recording",
    content:
      "Simply click the recording button once to start recording. Once you are done, click it again to stop.",
    image: "/img/recorder.png",
    alt: "Recording Mode",
  },
  {
    title: "Replay Audio",
    content:
      "You can also replay, pause, and resume audio responses from the chatbot here.",
    image: "/img/replay-audio.jpg",
    alt: "Replay Audio",
  },
  {
    title: "Save Message",
    content:
      "If you resonate with a message and want to save it for future references, you may simply click on the save button.",
    image: "/img/save-msg.jpg",
    alt: "Save Message",
  },
  {
    title: "View Saved Messages",
    content:
      "To view the saved messages, simply click on 'Saved Messages' button in the sidebar.",
    image: "/img/view-saved-msg.png",
    alt: "View Saved Messages",
  },
  {
    title: "Delete Messages",
    content:
      "To delete the saved messages, simply click on the delete button here.",
    image: "/img/delete.jpg",
    alt: "Delete Saved Messages",
  },
  {
    title: "Change Settings",
    content:
      "You can toggle between Day/Night modes, adjust font size, and turn on high contrast mode in the Settings",
    image: "/img/settings.png",
    alt: "Settings",
  },
];

const HelpModal = () => {
  const { showHelp, toggleHelp } = useModal();
  const [pageIndex, setPageIndex] = useState(0);

  if (!showHelp) return null;

  const nextPage = () =>
    setPageIndex((prev) => Math.min(prev + 1, helpPages.length - 1));
  const prevPage = () => setPageIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative text-black">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">
            {helpPages[pageIndex].title}
          </h2>
          <p className="mb-6">{helpPages[pageIndex].content}</p>
          <Image
            src={helpPages[pageIndex].image}
            alt={helpPages[pageIndex].alt}
            width={250}
            height={150}
            className="self-center mb-6"
          />
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={prevPage}
            disabled={pageIndex === 0}
            className="text-blue-600 disabled:text-gray-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">
            {pageIndex + 1} / {helpPages.length}
          </span>
          {pageIndex === helpPages.length - 1 ? (
            <button onClick={() => toggleHelp()} className="text-blue-600">
              Done
            </button>
          ) : (
            <button onClick={nextPage} className="text-blue-600">
              Next
            </button>
          )}
        </div>
        <button
          onClick={() => toggleHelp()}
          className="absolute top-3 right-4 text-xl text-gray-400 hover:text-black"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
