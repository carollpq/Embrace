import Image from "next/image";
import React from "react";

interface SelectionCardProps {
  title: string;
  description: string;
  svg?: string;
  onClick?: () => void;
  isSelected?: boolean;
  titleStyle?: string;
  descStyle?: string;
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  svg = "",
  onClick,
  isSelected,
  titleStyle = "",
  descStyle = "",
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col justify-center items-center button-transition w-[220px] h-[220px] sm:w-[250px] sm:h-[250px] text-black/60 font-semibold text-lg sm:text-xl rounded-[20px] drop-shadow-default ${
        isSelected
          ? "bg-white/90 text-black/80 hover:cursor-pointer" // Highlighted style for selected card
          : "bg-white/60 hover:bg-white/80 hover:text-black/80 hover:cursor-pointer" // Default style
      }`}
    >
      <h2 className={`${titleStyle ? titleStyle: "text-left absolute top-5 left-8 sm:text-md text-sm text-black/90"}`}>{title}</h2>
      <div className="flex flex-row px-8 flex-wrap">
        <span className={`${descStyle ? descStyle : "font-semibold sm:text-sm text-xs absolute left-8 top-12 pr-8"}`}>
          {description}
        </span>
        {svg && (
          <Image
            className="absolute bottom-0 right-5"
            src={svg}
            alt=""
            width={125}
            height={125}
          />
        )}
      </div>
    </div>
  );
};

export default SelectionCard;
