// Credit: https://stackoverflow.com/a/50644701, (2021-03-14: Support ?playlist)
export const dailyMotionUrlRegex =
  /^(?:(?:https?):)?(?:\/\/)?(?:www\.)?(?:(?:dailymotion\.com(?:\/embed)?\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w_-]+)?(?:\?playlist=[a-zA-Z0-9]+)?$/;
export const getDailyMotionIdFromUrl = (url: string): string => {
  return url.match(dailyMotionUrlRegex)?.[1] ?? '';
};
export const getDailyMotionEmbedFromId = (id: string): string => {
  return `https://www.dailymotion.com/embed/video/${id}`; // ?autoplay=1
};
