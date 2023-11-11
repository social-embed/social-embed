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
      },
      items: ["lib/index", "lib/installation", "lib/release-notes"],
    },
    {
      type: "category",
      label: "▶️ @social-embed/wc",
      collapsed: false,
      link: {
        type: "generated-index",
      },
      items: [
        "wc/index",
        "wc/installation",
        {
          type: "category",
          label: "Providers",
          collapsed: false,
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
          items: [
            "wc/configuration/dimensions",
            "wc/configuration/allowfullscreen",
            "wc/configuration/url",
          ],
        },
        "wc/release-notes",
      ],
    },
    "news",
  ],
};

export default sidebars;
