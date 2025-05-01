'use client';

export const ModeButton = ({
  mode,
  currentMode,
  label,
  onClick,
  showHelp
}: {
  mode: string;
  currentMode: string;
  label: string;
  onClick: (mode: string) => void;
  showHelp: boolean;
}) => (
  <div
    onClick={() => onClick(mode)}
    className={`${
      currentMode === mode ? 'bg-white/70 text-black' : 'bg-black/50'
    } rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
      showHelp ? 'textbox-highlight-glow' : ''
    }`}
  >
    <span>{label}</span>
  </div>
);