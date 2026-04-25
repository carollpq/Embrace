type SpinnerSize = "sm" | "md" | "lg";

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10 sm:w-12 sm:h-12",
  lg: "w-12 h-12",
};

export default function LoadingSpinner({ size = "md" }: { size?: SpinnerSize }) {
  return (
    <div
      className={`${sizeClasses[size]} border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mt-3`}
    />
  );
}
