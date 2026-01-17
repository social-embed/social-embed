import { RerollButton } from "../playground/RerollButton";
import { DemoCard } from "./DemoCard";

/**
 * UX Components browse page.
 */
export function DemoUxBrowse() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          UX Components
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Interactive components for buttons, toggles, and other UI elements.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DemoCard
          description="Button styles including animated action buttons"
          href="/demo/ux/button"
          preview={
            <div className="flex items-center gap-2">
              <RerollButton variant="xs" />
              <RerollButton variant="sm" />
            </div>
          }
          title="Button"
        />
        <DemoCard
          description="Callout/admonition variants for notes, tips, cautions, and warnings"
          href="/demo/ux/aside"
          preview={
            <div className="flex flex-col gap-1 text-[10px]">
              <div className="flex items-center gap-1 rounded-r border-l-2 border-blue-500 bg-blue-50 px-1.5 py-0.5 dark:bg-blue-500/10">
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  Note
                </span>
              </div>
              <div className="flex items-center gap-1 rounded-r border-l-2 border-green-500 bg-green-50 px-1.5 py-0.5 dark:bg-green-500/10">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  Tip
                </span>
              </div>
            </div>
          }
          title="Aside"
        />
      </div>
    </div>
  );
}
