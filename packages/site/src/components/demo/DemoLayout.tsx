import type { ReactNode } from "react";

export type DemoNavItem = {
  label: string;
  href: string;
  items?: DemoNavItem[];
};

type DemoLayoutProps = {
  title?: string;
  currentPath: string;
  children: ReactNode;
};

const navigation: DemoNavItem[] = [
  { href: "/demo", label: "Overview" },
  {
    href: "/demo/ux",
    items: [
      { href: "/demo/ux/button", label: "Button" },
      { href: "/demo/ux/aside", label: "Aside" },
    ],
    label: "UX Components",
  },
  {
    href: "/demo/widgets",
    items: [
      {
        href: "/demo/widgets/playground",
        items: [
          { href: "/demo/widgets/playground/wc", label: "WC Playground" },
          { href: "/demo/widgets/playground/lib", label: "Lib Playground" },
        ],
        label: "Playground",
      },
    ],
    label: "Widgets",
  },
];

function NavItem({
  item,
  normalizedPath,
  depth = 0,
}: {
  item: DemoNavItem;
  normalizedPath: string;
  depth?: number;
}): ReactNode {
  const itemPath = item.href.replace(/\/$/, "");
  const isActive =
    normalizedPath === itemPath || normalizedPath.startsWith(`${itemPath}/`);
  const isExactMatch = normalizedPath === itemPath;

  // Top-level items
  if (depth === 0) {
    return (
      <div key={item.href}>
        <a
          className={`block rounded-md px-3 py-2 text-sm no-underline transition ${
            isActive
              ? "bg-slate-200 font-medium text-slate-900 dark:bg-slate-800 dark:text-white"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
          href={item.href}
        >
          {item.label}
        </a>
        {item.items && isActive && (
          <div className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700">
            {item.items.map((subItem) => (
              <NavItem
                depth={depth + 1}
                item={subItem}
                key={subItem.href}
                normalizedPath={normalizedPath}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Nested items
  return (
    <div key={item.href}>
      <a
        className={`block rounded-md px-2 py-1.5 text-xs no-underline transition ${
          isExactMatch
            ? "font-medium text-slate-900 dark:text-white"
            : isActive
              ? "font-medium text-slate-700 dark:text-slate-300"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        }`}
        href={item.href}
      >
        {item.label}
      </a>
      {item.items && isActive && (
        <div className="ml-2 mt-1 space-y-1 border-l border-slate-200 pl-2 dark:border-slate-700">
          {item.items.map((subItem) => (
            <NavItem
              depth={depth + 1}
              item={subItem}
              key={subItem.href}
              normalizedPath={normalizedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DemoLayout({
  title = "Demo",
  currentPath,
  children,
}: DemoLayoutProps): ReactNode {
  // Normalize path (remove trailing slash for comparison)
  const normalizedPath = currentPath.replace(/\/$/, "") || "/demo";

  return (
    <div className="flex h-full min-h-0">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 md:block">
        <div className="sticky top-0 flex h-full flex-col overflow-y-auto p-4">
          <h1 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h1>
          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavItem
                item={item}
                key={item.href}
                normalizedPath={normalizedPath}
              />
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800 md:hidden">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h1>
        </header>

        {/* Main content */}
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
