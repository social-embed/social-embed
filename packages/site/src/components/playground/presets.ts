/**
 * Provider-focused preset code examples for the playground.
 */

export interface Preset {
  id: string;
  name: string;
  description: string;
  code: string;
}

const WC_SCRIPT = '<script type="module" src="{{WC_URL}}"></script>';

export const PRESETS: Preset[] = [
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    o-embed { max-width: 560px; }
  </style>
</head>
<body>
  <h2>YouTube Video</h2>
  <o-embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></o-embed>
</body>
</html>`,
    description: "Embed a YouTube video with the <o-embed> component",
    id: "youtube",
    name: "YouTube",
  },
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    o-embed { max-width: 560px; }
  </style>
</head>
<body>
  <h2>YouTube Shorts</h2>
  <o-embed url="https://www.youtube.com/shorts/abc123"></o-embed>
</body>
</html>`,
    description: "Embed a YouTube Shorts video",
    id: "youtube-shorts",
    name: "YouTube Shorts",
  },
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    o-embed { max-width: 400px; }
  </style>
</head>
<body>
  <h2>Spotify Track</h2>
  <o-embed url="https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT"></o-embed>
</body>
</html>`,
    description: "Embed a Spotify track",
    id: "spotify-track",
    name: "Spotify Track",
  },
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    o-embed { max-width: 400px; }
  </style>
</head>
<body>
  <h2>Spotify Playlist</h2>
  <o-embed url="https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"></o-embed>
</body>
</html>`,
    description: "Embed a Spotify playlist",
    id: "spotify-playlist",
    name: "Spotify Playlist",
  },
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    o-embed { max-width: 560px; }
  </style>
</head>
<body>
  <h2>Vimeo Video</h2>
  <o-embed url="https://vimeo.com/134668506"></o-embed>
</body>
</html>`,
    description: "Embed a Vimeo video",
    id: "vimeo",
    name: "Vimeo",
  },
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    o-embed { max-width: 560px; }
  </style>
</head>
<body>
  <h2>DailyMotion Video</h2>
  <o-embed url="https://www.dailymotion.com/video/x8m8jnf"></o-embed>
</body>
</html>`,
    description: "Embed a DailyMotion video",
    id: "dailymotion",
    name: "DailyMotion",
  },
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    o-embed { max-width: 560px; }
  </style>
</head>
<body>
  <h2>Loom Video</h2>
  <o-embed url="https://www.loom.com/share/abc123"></o-embed>
</body>
</html>`,
    description: "Embed a Loom screen recording",
    id: "loom",
    name: "Loom",
  },
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    o-embed { max-width: 560px; }
  </style>
</head>
<body>
  <h2>EdPuzzle Video</h2>
  <o-embed url="https://edpuzzle.com/media/abc123"></o-embed>
</body>
</html>`,
    description: "Embed an EdPuzzle interactive video",
    id: "edpuzzle",
    name: "EdPuzzle",
  },
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    o-embed { max-width: 560px; }
  </style>
</head>
<body>
  <h2>Wistia Video</h2>
  <o-embed url="https://support.wistia.com/medias/26sk4lmiix"></o-embed>
</body>
</html>`,
    description: "Embed a Wistia video",
    id: "wistia",
    name: "Wistia",
  },
  {
    code: `<!DOCTYPE html>
<html>
<head>
  ${WC_SCRIPT}
  <style>
    body { font-family: system-ui; padding: 20px; }
    .grid { display: grid; gap: 20px; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
    o-embed { max-width: 100%; }
  </style>
</head>
<body>
  <h2>Multiple Embeds</h2>
  <div class="grid">
    <o-embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"></o-embed>
    <o-embed url="https://vimeo.com/134668506"></o-embed>
  </div>
</body>
</html>`,
    description: "Display multiple embedded videos in a grid",
    id: "multiple",
    name: "Multiple Embeds",
  },
];

export const DEFAULT_PRESET = PRESETS[0];

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find((preset) => preset.id === id);
}
