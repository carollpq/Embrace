"use client";
import { useModal } from "@/context/ModalContext";

const TTSFallbackModal = () => {
  const { showTTSFallback, closeTTSFallback } = useModal();

  if (!showTTSFallback) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
      <div className="bg-black text-white p-6 rounded-lg w-[320px] shadow-xl">
        <p className="mb-4 text-md font-medium text-center">
          You&quot;re offline or Polly TTS failed. Switching to your device&quot;s voice engine.
        </p>
        <div className="flex justify-center mt-6">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={closeTTSFallback}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default TTSFallbackModal;
