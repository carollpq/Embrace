"use client";
import { ChangeEvent } from 'react';

interface TextInputProps {
  label: string;
  type?: string; // Optional prop to specify input type
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function TextInput({ label, type = "text", value, onChange }: TextInputProps) {

  return (
    <div className="flex flex-col justify-start gap-2 max-w-[350px] w-full">
      <label htmlFor={label.toLowerCase()} className="text-left text-white/50">{label}</label>
      <div className="text-left p-2 px-5 text-xl text-white/40 font-normal border-4 border-white/50 rounded-[50px] backdrop-blur-[50px] justify-start items-center">
        <input
          type={type} // Sets input type dynamically
          id={label.toLowerCase()}
          value={value}
          onChange={onChange}
          autoComplete="off" //Disables autofill
          className="bg-transparent focus:outline-none w-full"
        />
      </div>
    </div>
  );
}

export default TextInput;
