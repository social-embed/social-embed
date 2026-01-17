/**
 * Generates sidebar navigation items from the content collection.
 */
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

type DocsEntry = CollectionEntry<"docs">;

export interface SidebarLink {
  label: string;
  href: string;
  order?: number;
}

export interface SidebarSection {
  label: string;
  badge?: {
    text: string;
    variant?: "note" | "tip" | "caution" | "danger" | "success";
  };
  items: SidebarLink[];
  collapsed?: boolean;
}

export type SidebarItem = SidebarLink | SidebarSection;

function isSection(item: SidebarItem): item is SidebarSection {
  return "items" in item;
}

/**
 * Sort items by order (if specified) then alphabetically.
 */
function sortItems(items: SidebarLink[]): SidebarLink[] {
  return [...items].sort((a, b) => {
    // Items with order come first
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    // Then sort alphabetically
    return a.label.localeCompare(b.label);
  });
}

/**
 * Map a content collection entry ID to a URL slug.
 * Handles: "lib/00-index.mdx" -> "/lib/"
 *          "wc/providers/youtube.mdx" -> "/wc/providers/youtube"
 */
function entryIdToSlug(id: string): string {
  // Remove extension
  let slug = id.replace(/\.(mdx?|md)$/, "");

  // Handle index files (00-index -> directory index)
  if (slug.endsWith("00-index") || slug.endsWith("/index")) {
    slug = slug.replace(/\/?00-index$/, "").replace(/\/?index$/, "");
  }

  // Handle 00- prefix for ordering (e.g., "00-getting-started" -> "getting-started")
  slug = slug
    .split("/")
    .map((part) => part.replace(/^\d+-/, ""))
    .join("/");

  return `/${slug}/`.replace(/\/+/g, "/");
}

/**
 * Extract a readable label from a content entry.
 */
function getEntryLabel(entry: {
  id: string;
  data: {
    title?: string;
    sidebar_label?: string;
    sidebar?: { label?: string };
  };
}): string {
  // Priority: sidebar.label > sidebar_label > title > ID
  return (
    entry.data.sidebar?.label ||
    entry.data.sidebar_label ||
    entry.data.title ||
    entry.id
      .split("/")
      .pop()
      ?.replace(/^\d+-/, "")
      .replace(/\.(mdx?|md)$/, "") ||
    entry.id
  );
}

/**
 * Get items from content collection for a specific directory.
 */
async function getItemsFromDirectory(
  directory: string,
): Promise<SidebarLink[]> {
  const docs = await getCollection("docs");

  // Filter entries for this directory
  const dirEntries = docs.filter((entry: DocsEntry) => {
    const parts = entry.id.split("/");
    // Match entries in this directory (but not subdirectories for now)
    return parts[0] === directory && parts.length <= 2;
  });

  return dirEntries.map((entry: DocsEntry) => ({
    href: entryIdToSlug(entry.id),
    label: getEntryLabel(entry),
    order: entry.data.sidebar?.order,
  }));
}

/**
 * Get grouped items (e.g., wc/providers/*, wc/configuration/*).
 */
async function getGroupedItems(directory: string): Promise<SidebarSection[]> {
  const docs = await getCollection("docs");

  // Find subdirectories
  const subdirs = new Set<string>();
  for (const entry of docs) {
    const parts = entry.id.split("/");
    if (parts[0] === directory && parts.length > 2) {
      subdirs.add(parts[1]);
    }
  }

  const groups: SidebarSection[] = [];

  for (const subdir of subdirs) {
    const subEntries = docs.filter((entry: DocsEntry) => {
      const parts = entry.id.split("/");
      return parts[0] === directory && parts[1] === subdir;
    });

    if (subEntries.length > 0) {
      const items = subEntries.map((entry: DocsEntry) => ({
        href: entryIdToSlug(entry.id),
        label: getEntryLabel(entry),
        order: entry.data.sidebar?.order,
      }));

      groups.push({
        items: sortItems(items),
        label: subdir.charAt(0).toUpperCase() + subdir.slice(1),
      });
    }
  }

  return groups;
}

/**
 * Build the full sidebar structure.
 */
export async function getSidebarItems(): Promise<SidebarItem[]> {
  const docs = await getCollection("docs");

  // Root level items
  const rootItems = docs
    .filter((entry: DocsEntry) => !entry.id.includes("/"))
    .map((entry: DocsEntry) => ({
      href: entryIdToSlug(entry.id),
      label: getEntryLabel(entry),
      order: entry.data.sidebar?.order,
    }));

  // Library section
  const libItems = await getItemsFromDirectory("lib");

  // Web Component section (including subdirectories)
  const wcItems = await getItemsFromDirectory("wc");
  const wcGroups = await getGroupedItems("wc");

  const sidebar: SidebarItem[] = [
    // Getting started (root)
    ...sortItems(
      rootItems.filter((item: SidebarLink) =>
        item.href.includes("getting-started"),
      ),
    ),

    // Other root items (migration, news) - right after getting started
    ...sortItems(
      rootItems.filter(
        (item: SidebarLink) =>
          !item.href.includes("getting-started") &&
          item.href !== "/lib/" &&
          item.href !== "/wc/",
      ),
    ),

    // Library section
    {
      badge: { text: "lib", variant: "note" },
      items: sortItems(libItems),
      label: "Library",
    },

    // Lib Playground (manual)
    {
      badge: { text: "try it", variant: "success" },
      items: [
        { href: "/lib/playground/", label: "Interactive" },
        { href: "/lib/playground/external/", label: "More Sandboxes" },
      ],
      label: "Lib Playground",
    },

    // Web Component section
    {
      badge: { text: "wc", variant: "tip" },
      items: sortItems(wcItems),
      label: "Web Component",
    },

    // WC subgroups (providers, configuration)
    ...wcGroups,

    // WC Playground (manual)
    {
      badge: { text: "try it", variant: "success" },
      items: [
        { href: "/wc/playground/", label: "Interactive" },
        { href: "/wc/playground/external/", label: "More Sandboxes" },
      ],
      label: "WC Playground",
    },
  ];

  return sidebar;
}

export { isSection };
