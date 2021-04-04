module.exports = {
  sidebar: [
    {
      '@social-embed': [
        'home',
        {
          type: 'category',
          label: '⚙️ @social-embed/lib',
          collapsed: false,
          items: [
            'lib/index',
            'lib/installation',
            {
              type: 'category',
              label: 'API',
              collapsed: false,
              items: require('./typedoc-sidebar-lib.js').map((item) => {
                const prefix = `lib/`;
                if (item.items) {
                  item.items = item.items.map((i) => {
                    if (i.includes(prefix)) {
                      return i;
                    }
                    return `${prefix}${i}`;
                  });
                  return item;
                }
                if (item.includes(prefix)) {
                  return item;
                }
                return `${prefix}${item}`;
              }),
            },
            'lib/release-notes',
          ],
        },
        {
          type: 'category',
          label: '▶️ @social-embed/wc',
          collapsed: false,
          items: [
            'wc/index',
            'wc/installation',
            {
              type: 'category',
              label: 'Providers',
              collapsed: false,
              items: [
                'wc/providers/youtube',
                'wc/providers/dailymotion',
                'wc/providers/spotify',
                'wc/providers/vimeo',
              ],
            },
            {
              type: 'category',
              label: 'Configuration',
              collapsed: false,
              items: [
                'wc/configuration/dimensions',
                'wc/configuration/allowfullscreen',
                'wc/configuration/url',
              ],
            },
            {
              type: 'category',
              label: 'API',
              collapsed: false,
              items: require('./typedoc-sidebar-wc.js').map((item) => {
                const prefix = `wc/`;
                if (item.items) {
                  item.items = item.items.map((i) => {
                    if (i.includes(prefix)) {
                      return i;
                    }
                    return `${prefix}${i}`;
                  });
                  return item;
                }
                if (item.includes(prefix)) {
                  return item;
                }
                return `${prefix}${item}`;
              }),
            },

            'wc/release-notes',
          ],
        },
        'news',
      ],
    },
  ],
};
