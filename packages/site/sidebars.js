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
              items: require('./typedoc-sidebar-lib.js'),
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
                'wc/providers/wistia',
                'wc/providers/loom',
                'wc/providers/edpuzzle',
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
              items: require('./typedoc-sidebar-wc.js'),
            },

            'wc/release-notes',
          ],
        },
        'news',
      ],
    },
  ],
};
