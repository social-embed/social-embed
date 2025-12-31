import { useState } from "react";

export type RerollButtonProps = {
  /** 'compact' = icon only (xs), 'full' = icon + label (sm), 'md' = medium with label */
  variant?: "compact" | "full" | "md";
  onClick?: () => void;
  className?: string;
};

const compactClasses =
  "flex cursor-pointer select-none items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-1 text-xs font-bold text-white shadow-sm transition-all hover:from-indigo-600 hover:to-purple-600 active:scale-95 dark:from-indigo-400 dark:to-purple-400";

const fullClasses =
  "flex cursor-pointer select-none items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1.5 text-sm font-bold text-white shadow-md transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg active:scale-95 dark:from-indigo-400 dark:to-purple-400 dark:shadow-indigo-500/20";

const mdClasses =
  "flex cursor-pointer select-none items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-base font-bold text-white shadow-md transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-lg active:scale-95 dark:from-indigo-400 dark:to-purple-400 dark:shadow-indigo-500/20";

export function RerollButton({
  variant = "compact",
  onClick,
  className = "",
}: RerollButtonProps) {
  const [rerollKey, setRerollKey] = useState(0);

  const handleClick = () => {
    onClick?.();
    setRerollKey((k) => k + 1);
  };

  const baseClasses =
    variant === "md"
      ? mdClasses
      : variant === "full"
        ? fullClasses
        : compactClasses;

  return (
    <button
      className={`${baseClasses} animate-[bounce-pop_0.3s_ease-out] ${className}`}
      key={rerollKey}
      onClick={handleClick}
      title="Reroll"
      type="button"
    >
      <span className="inline-block animate-[spin-dice_0.3s_ease-out]">🎲</span>
      {(variant === "full" || variant === "md") && "Reroll"}
    </button>
  );
}
