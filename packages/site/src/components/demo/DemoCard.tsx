import type { ReactNode } from "react";

type DemoCardProps = {
  title: string;
  description: string;
  href: string;
  preview?: ReactNode;
};

export function DemoCard({
  description,
  href,
  preview,
  title,
}: DemoCardProps): ReactNode {
  return (
    <a
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white no-underline transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
      href={href}
    >
      {preview && (
        <div className="flex h-32 items-center justify-center border-b border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
          {preview}
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-medium text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {title}
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </div>
    </a>
  );
}
