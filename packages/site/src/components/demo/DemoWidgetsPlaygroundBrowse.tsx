import { DemoCard } from "./DemoCard";

/**
 * Playground widgets browse page - shows WC and Lib playground widgets.
 */
export function DemoWidgetsPlaygroundBrowse() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Playground Widgets
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Compact, responsive playground widgets for testing embeds and URL
          transformations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DemoCard
          description="Compact code editor with live preview and console output"
          href="/demo/widgets/playground/wc"
          preview={
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl">📺</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Code + Preview + Console
              </span>
            </div>
          }
          title="WC Playground"
        />
        <DemoCard
          description="URL transformation tester with provider detection"
          href="/demo/widgets/playground/lib"
          preview={
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl">🔗</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                URL → Embed URL
              </span>
            </div>
          }
          title="Lib Playground"
        />
      </div>
    </div>
  );
}
