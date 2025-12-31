import type { ReactNode } from "react";

type DemoSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function DemoSection({
  children,
  className,
  description,
  title,
}: DemoSectionProps): ReactNode {
  return (
    <section className={`space-y-4 ${className ?? ""}`}>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      <div>{children}</div>
    </section>
  );
}
