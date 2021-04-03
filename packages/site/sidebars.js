module.exports = {
  sidebar: [
    {
      '@social-embed': [
        'home',
        {
          type: 'category',
          label: '⚙️ @social-embed/lib',
          collapsed: false,
          items: ['lib/index', 'lib/installation', 'lib/release-notes'],
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
            'wc/release-notes',
          ],
        },
        'news',
      ],
    },
  ],
};
