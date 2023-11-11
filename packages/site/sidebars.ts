import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  sidebar: [
    "home",
    {
      type: "category",
      label: "⚙️ @social-embed/lib",
      collapsed: false,
      link: {
        type: "generated-index",
        slug: "lib/",
      },
      items: ["lib/overview", "lib/installation", "lib/release-notes"],
    },
    {
      type: "category",
      label: "▶️ @social-embed/wc",
      collapsed: false,
      link: {
        type: "generated-index",
        slug: "wc/",
      },
      items: [
        "wc/overview",
        "wc/installation",
        {
          type: "category",
          label: "Providers",
          collapsed: false,
          link: {
            type: "generated-index",
          },
          items: [
            "wc/providers/generic",
            "wc/providers/youtube",
            "wc/providers/dailymotion",
            "wc/providers/spotify",
            "wc/providers/vimeo",
            "wc/providers/wistia",
            "wc/providers/loom",
            "wc/providers/edpuzzle",
          ],
        },
        {
          type: "category",
          label: "Configuration",
          collapsed: false,
          link: {
            type: "generated-index",
          },
          items: [
            "wc/configuration/dimensions",
            "wc/configuration/allowfullscreen",
            "wc/configuration/url",
          ],
        },
        "wc/contributing",
        "wc/release-notes",
      ],
    },
    "news",
  ],
};

export default sidebars;
