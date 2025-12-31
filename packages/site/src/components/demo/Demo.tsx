import { RerollButton } from "../playground/RerollButton";
import { DemoSection } from "./DemoSection";

/**
 * Demo page showcasing UI components.
 */
export function Demo() {
  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          UI Components
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Reusable components for the social-embed playground and documentation.
        </p>
      </div>

      {/* Reroll Button - Icon Only */}
      <DemoSection
        description="Compact icon-only button with spin animation on click."
        title="Reroll Button (Icon Only)"
      >
        <div className="flex flex-wrap items-center gap-4">
          <RerollButton />
          <span className="text-xs text-slate-500">Click to see animation</span>
        </div>
      </DemoSection>

      {/* Reroll Button - Icon + Text */}
      <DemoSection
        description="Full button with icon and label."
        title="Reroll Button (Icon + Text)"
      >
        <div className="flex flex-wrap items-center gap-4">
          <RerollButton variant="full" />
          <span className="text-xs text-slate-500">Click to see animation</span>
        </div>
      </DemoSection>

      {/* Size Variants */}
      <DemoSection
        description="Reroll buttons in different sizes for various contexts."
        title="Sizes"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-500">xs (compact)</span>
            <RerollButton variant="compact" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-500">sm (full)</span>
            <RerollButton variant="full" />
          </div>
        </div>
      </DemoSection>

      {/* Animation Details */}
      <DemoSection title="Animation CSS">
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <pre className="bg-slate-50 p-4 text-xs dark:bg-slate-900">
            <code className="text-slate-800 dark:text-slate-200">{`/* In tailwind.css */
@keyframes spin-dice {
  from { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  to { transform: rotate(360deg) scale(1); }
}

@keyframes bounce-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
}

/* Usage: animate-[spin-dice_0.3s_ease-out] */
/* Usage: animate-[bounce-pop_0.3s_ease-out] */`}</code>
          </pre>
        </div>
      </DemoSection>
    </div>
  );
}
