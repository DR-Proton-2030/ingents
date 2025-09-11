import React from "react";
import { ArrowUp } from "lucide-react";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(" ");

interface SearchBoxProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  onSearch = () => {},
  placeholder = "Search...",
  className,
  disabled = false,
}) => {
  const [input, setInput] = React.useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <form
      className={cn(
        "flex items-center w-full rounded-3xl border border-[#444444] bg-[#1F2023] px-3 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.24)] transition-all duration-300",
        className
      )}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex-1 bg-transparent border-none outline-none text-base text-gray-100 placeholder:text-gray-400 px-2 py-1",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="submit"
        className={cn(
          "ml-2 h-8 w-8 rounded-full flex items-center justify-center bg-white hover:bg-white/80 text-[#1F2023] transition-all duration-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        disabled={disabled || !input.trim()}
        aria-label="Send"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </form>
  );
};
