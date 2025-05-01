import React from "react";
import SelectionCard from "./ui/SelectionCard";
import GeneralButton from "./ui/button";
import { useModal } from "@/context/ModalContext";

const Disclaimer = () => {
  const { toggleDisclaimer } = useModal();
  return (
    <div className="flex flex-col items-center mt-14 overflow-y-auto space-y-4 py-6">
      <h2 className="text-2xl sm:text-3xl font-medium text-white animate-slideUp delay-1000 text-center">
        Important Things to Take Note
      </h2>
      {/* Selection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-2 gap-4 animate-slideUp delay-1000">
        <SelectionCard
          titleStyle="text-left absolute top-5 left-8 sm:text-md text-sm text-black w-[80%]"
          descStyle="font-semibold absolute sm:text-sm text-xs left-8 top-16 pr-8 pt-2"
          title="This is a supportive but temporary space"
          description="You can talk to the chatbot when you need someone to listen. But it’s not meant for long-term care or crisis intervention."
          isSelected={true}
        />
        <SelectionCard
          titleStyle="text-left absolute top-5 left-8 sm:text-md text-sm text-black w-[80%]"
          descStyle="font-semibold absolute sm:text-sm text-xs left-8 top-16 pr-8 pt-2"
          title="This app does not replace professional help"
          description="While we're here to support you emotionally, we can’t diagnose or treat mental health conditions."
          isSelected={true}
        />
        <SelectionCard
          titleStyle="text-left absolute top-5 left-8 sm:text-md text-sm text-black w-[80%]"
          descStyle="font-semibold absolute sm:text-sm text-xs left-8 top-16 pr-8 pt-2"
          title="In a crisis, please seek real-time support"
          description="If you're in danger or experiencing a mental health emergency, contact a crisis hotline or professional immediately."
          isSelected={true}
        />
        <SelectionCard
         titleStyle="text-left absolute top-5 left-8 sm:text-md text-sm text-black w-[80%]"
          descStyle="font-semibold absolute sm:text-sm text-xs left-8 top-16 pr-8 pt-2"
          title="You deserve real, human care"
          description="This chatbot is a tool to help you feel heard — but it’s important to reach out to trained professionals too."
          isSelected={true}
        />
      </div>
      {/* Navigation buttons */}
      <div className="flex flex-row justify-between w-full gap-8 animate-slideUp delay-1000">
        <GeneralButton
          className="bg-white/70 hover:bg-white/90 hover:text-black/90"
          text="Understood"
          onClick={() => {
            toggleDisclaimer(false);
          }}
        />
      </div>
    </div>
  );
};

export default Disclaimer;
