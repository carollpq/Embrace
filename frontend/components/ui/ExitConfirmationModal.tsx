"use client";
import React from "react";

const ExitConfirmationModal = ({
  setShowConfirmExit,
  confirmExitCallback,
}: {
  setShowConfirmExit: (show: boolean) => void;
  confirmExitCallback: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">
      <div className="bg-black text-white p-6 rounded-lg w-[320px] shadow-xl">
        <p className="mb-4 text-md font-medium">
          Are you sure you want to leave this chat? You won't be able to return
          to this conversation.
        </p>
        <div className="flex justify-center gap-3 mt-6 text-black">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={() => setShowConfirmExit(false)}
          >
            Stay
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              setShowConfirmExit(false);
              confirmExitCallback();
            }}
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmationModal;
