"use client";

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
}

function TextInput({ label, name, type = "text", defaultValue, error }: TextInputProps) {
  return (
    <div className="flex flex-col justify-start gap-2 w-full max-w-[90vw] sm:max-w-[350px]">
      <label htmlFor={name} className="text-left text-white/50">{label}</label>
      <div className="text-left p-2 px-5 text-xl text-white/40 font-normal border-4 border-white/50 rounded-[50px] backdrop-blur-[50px] justify-start items-center">
        <input
          type={type}
          id={name}
          name={name}
          defaultValue={defaultValue}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          autoComplete="off"
          className="bg-transparent focus:outline-none w-full"
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="text-sm text-rose-300/90 pl-2">
          {error}
        </p>
      )}
    </div>
  );
}

export default TextInput;
