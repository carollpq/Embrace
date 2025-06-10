"use client";

import Image from "next/image";

export const MenuItem = ({
  active,
  label,
  icon,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  icon: string;
  onClick: () => void;
  children?: React.ReactNode;
}) => (
  <div
    className={`rounded-lg drop-shadow-md text-left py-2 px-6 flex flex-row justify-between items-center hover:bg-white/70 hover:text-black hover:cursor-pointer ${
      active ? "bg-white/70 text-black" : "bg-black/50"
    }`}
    onClick={onClick}
  >
    <span>{label}</span>
    <Image src={icon} alt={`${label} icon`} width={16} height={16} />
    {children}
  </div>
);
