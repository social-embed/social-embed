import { DemoCard } from "./DemoCard";

/**
 * Widgets browse page - shows available widget categories.
 */
export function DemoWidgetsBrowse() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Widgets
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Embeddable, self-contained components for testing and showcasing
          social-embed features.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DemoCard
          description="Interactive playgrounds for web component and library testing"
          href="/demo/widgets/playground"
          preview={
            <div className="flex items-center gap-3 text-4xl">
              <span>🎮</span>
              <span className="text-slate-400">+</span>
              <span>📝</span>
            </div>
          }
          title="Playground Widgets"
        />
      </div>
    </div>
  );
}
