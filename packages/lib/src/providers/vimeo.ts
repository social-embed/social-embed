// Credit: https://stackoverflow.com/a/50777192 (2021-03-14: modified / fixed to ignore unused groups)
export const vimeoUrlRegex =
  /(?:(?:https?):)?(?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;

export const getVimeoIdFromUrl = (url: string): string =>
  url.match(vimeoUrlRegex)?.[1] ?? "";

export const getVimeoEmbedUrlFromId = (id: string): string =>
  `https://player.vimeo.com/video/${id}`;
