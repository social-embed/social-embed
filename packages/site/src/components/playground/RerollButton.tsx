import { useState } from "react";

export type RerollButtonProps = {
  /** Size variant: xxs (20px), xs (22px), sm (24px), md (32px), lg (36px), xl (40px), xxl (44px), xxxl (48px) */
  variant?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl";
  /** Show "Reroll" label (default: false) */
  showLabel?: boolean;
  /** Whether to play the animation on initial mount (default: false) */
  animateOnMount?: boolean;
  onClick?: () => void;
  className?: string;
};

// Base classes shared across all sizes
const baseClasses =
  "flex cursor-pointer select-none items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 font-bold text-white transition-all hover:from-indigo-600 hover:to-purple-600 active:scale-95 dark:from-indigo-400 dark:to-purple-400";

// Size classes: height, text size, shadow (radius depends on context)
const sizeClasses = {
  lg: "h-9 text-sm shadow-md", // 36px
  md: "h-8 text-sm shadow-sm", // 32px
  sm: "h-6 text-xs shadow-sm", // 24px
  xl: "h-10 text-base shadow-md", // 40px
  xs: "h-[22px] text-[11px] shadow-sm", // 22px
  xxl: "h-11 text-lg shadow-md", // 44px
  xxs: "h-5 text-[11px] shadow-sm", // 20px
  xxxl: "h-12 text-xl shadow-lg", // 48px
};

// With label: padding + gap + radius (radius grows with size)
const withLabelClasses = {
  lg: "gap-2 px-4 rounded-lg",
  md: "gap-1.5 px-3 rounded-lg",
  sm: "gap-1 px-2 rounded-md",
  xl: "gap-2 px-4 rounded-lg",
  xs: "gap-1 px-1.5 rounded-sm",
  xxl: "gap-2 px-5 rounded-lg",
  xxs: "gap-1 px-1.5 rounded-sm",
  xxxl: "gap-2 px-5 rounded-lg",
};

// Icon-only: square + capped radius (icon stays dominant at larger sizes)
const iconOnlyClasses = {
  lg: "aspect-square rounded-lg",
  md: "aspect-square rounded-lg",
  sm: "aspect-square rounded-md",
  xl: "aspect-square rounded-lg",
  xs: "aspect-square rounded-sm",
  xxl: "aspect-square rounded-md", // capped
  xxs: "aspect-square rounded-sm",
  xxxl: "aspect-square rounded-md", // capped
};

export function RerollButton({
  variant = "md",
  showLabel = false,
  animateOnMount = false,
  onClick,
  className = "",
}: RerollButtonProps) {
  const shouldShowLabel = showLabel;

  // null = not yet clicked (no animation unless animateOnMount)
  // 0+ = clicked, animate on each increment
  const [rerollKey, setRerollKey] = useState<number | null>(
    animateOnMount ? 0 : null,
  );

  const handleClick = () => {
    onClick?.();
    setRerollKey((k) => (k ?? 0) + 1);
  };

  const shouldAnimate = rerollKey !== null;
  const bounceClass = shouldAnimate ? "animate-[bounce-pop_0.3s_ease-out]" : "";
  const spinClass = shouldAnimate ? "animate-[spin-dice_0.3s_ease-out]" : "";

  // Icon-only: square. With label: padded rectangle.
  const layoutClass = shouldShowLabel
    ? withLabelClasses[variant]
    : iconOnlyClasses[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses[variant]} ${layoutClass} ${bounceClass} ${className}`}
      key={rerollKey ?? "initial"}
      onClick={handleClick}
      title="Reroll"
      type="button"
    >
      <span className={`inline-block ${spinClass}`}>🎲</span>
      {shouldShowLabel && "Reroll"}
    </button>
  );
}
