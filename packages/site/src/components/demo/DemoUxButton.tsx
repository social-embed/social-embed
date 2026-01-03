import { RerollButton } from "../playground/RerollButton";
import { DemoSection } from "./DemoSection";

/**
 * Button demo page showcasing the RerollButton component.
 */
export function DemoUxButton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Button
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Button styles for actions, including animated action buttons.
        </p>
      </div>

      {/* Reroll Button Variants */}
      <DemoSection
        description="All RerollButton size variants. Each supports icon-only or icon+label via showLabel prop."
        title="Reroll Button Variants"
      >
        <div className="space-y-6">
          {/* Icon only row */}
          <div>
            <div className="mb-2 text-xs font-medium text-slate-500">
              Icon only
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xxs</span>
                <div className="text-[10px] text-slate-400">20px</div>
                <RerollButton showLabel={false} variant="xxs" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xs</span>
                <div className="text-[10px] text-slate-400">22px</div>
                <RerollButton showLabel={false} variant="xs" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">sm</span>
                <div className="text-[10px] text-slate-400">24px</div>
                <RerollButton showLabel={false} variant="sm" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">md</span>
                <div className="text-[10px] text-slate-400">32px</div>
                <RerollButton showLabel={false} variant="md" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">lg</span>
                <div className="text-[10px] text-slate-400">36px</div>
                <RerollButton showLabel={false} variant="lg" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xl</span>
                <div className="text-[10px] text-slate-400">40px</div>
                <RerollButton showLabel={false} variant="xl" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xxl</span>
                <div className="text-[10px] text-slate-400">44px</div>
                <RerollButton showLabel={false} variant="xxl" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xxxl</span>
                <div className="text-[10px] text-slate-400">48px</div>
                <RerollButton showLabel={false} variant="xxxl" />
              </div>
            </div>
          </div>

          {/* Icon + label row */}
          <div>
            <div className="mb-2 text-xs font-medium text-slate-500">
              Icon + label
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xxs</span>
                <div className="text-[10px] text-slate-400">20px</div>
                <RerollButton showLabel variant="xxs" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xs</span>
                <div className="text-[10px] text-slate-400">22px</div>
                <RerollButton showLabel variant="xs" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">sm</span>
                <div className="text-[10px] text-slate-400">24px</div>
                <RerollButton showLabel variant="sm" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">md</span>
                <div className="text-[10px] text-slate-400">32px</div>
                <RerollButton showLabel variant="md" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">lg</span>
                <div className="text-[10px] text-slate-400">36px</div>
                <RerollButton showLabel variant="lg" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xl</span>
                <div className="text-[10px] text-slate-400">40px</div>
                <RerollButton showLabel variant="xl" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xxl</span>
                <div className="text-[10px] text-slate-400">44px</div>
                <RerollButton showLabel variant="xxl" />
              </div>
              <div className="space-y-1 text-center">
                <span className="text-xs text-slate-500">xxxl</span>
                <div className="text-[10px] text-slate-400">48px</div>
                <RerollButton showLabel variant="xxxl" />
              </div>
            </div>
          </div>
        </div>
      </DemoSection>

      {/* Animate on Mount */}
      <DemoSection
        description="Use animateOnMount to play the animation when the component first renders."
        title="Animate on Mount"
      >
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-500">
              default (no animation)
            </span>
            <RerollButton variant="sm" />
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-500">animateOnMount</span>
            <RerollButton animateOnMount variant="sm" />
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
