import { RerollButton } from "../playground/RerollButton";
import { DemoCard } from "./DemoCard";

/**
 * Demo overview page with cards linking to subsections.
 */
export function DemoOverview() {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Demo Overview
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Explore UI components and patterns used in the social-embed site.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DemoCard
          description="Button styles including animated action buttons"
          href="/demo/ux"
          preview={
            <div className="flex items-center gap-2">
              <RerollButton variant="compact" />
              <RerollButton variant="full" />
            </div>
          }
          title="UX Components"
        />
      </div>
    </div>
  );
}
