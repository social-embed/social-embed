import {
  convertUrlToEmbedUrl,
  getDailyMotionEmbedFromId,
  getDailyMotionIdFromUrl,
  getVimeoEmbedUrlFromId,
  getVimeoIdFromUrl,
  getYouTubeEmbedUrlFromId,
  getYouTubeIdFromUrl,
} from '../src';

describe('convertUrlToEmbedUrl', () => {
  it('is defined', () => {
    expect(convertUrlToEmbedUrl.name).toEqual('convertUrlToEmbedUrl');
  });

  it('spotify', () => {
    expect(
      convertUrlToEmbedUrl('spotify:album:1DFixLWuPkv3KT3TnV35m3')
    ).toEqual('https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3');
    expect(
      convertUrlToEmbedUrl(
        'https://open.spotify.com/album/4RuzGKLG99XctuBMBkFFOC'
      )
    ).toEqual('https://open.spotify.com/embed/album/4RuzGKLG99XctuBMBkFFOC');
    expect(
      convertUrlToEmbedUrl('open.spotify.com/album/4RuzGKLG99XctuBMBkFFOC')
    ).toEqual('https://open.spotify.com/embed/album/4RuzGKLG99XctuBMBkFFOC');
  });

  it('dailymotion', () => {
    expect(
      convertUrlToEmbedUrl('https://www.dailymotion.com/video/x7znrd0')
    ).toEqual('https://www.dailymotion.com/embed/video/x7znrd0');
    expect(
      convertUrlToEmbedUrl('http://dailymotion.com/video/x7znrd0')
    ).toEqual('https://www.dailymotion.com/embed/video/x7znrd0');
    expect(convertUrlToEmbedUrl('dailymotion.com/video/x7znrd0')).toEqual(
      'https://www.dailymotion.com/embed/video/x7znrd0'
    );

    expect(getDailyMotionIdFromUrl('dailymotion.com/video/x7znrd0')).toEqual(
      'x7znrd0'
    );

    expect(getDailyMotionEmbedFromId('x7znrd0')).toEqual(
      'https://www.dailymotion.com/embed/video/x7znrd0'
    );
  });

  it('vimeo', () => {
    expect(convertUrlToEmbedUrl('https://vimeo.com/134668506')).toEqual(
      'https://player.vimeo.com/video/134668506'
    );
    expect(
      convertUrlToEmbedUrl('https://vimeo.com/channels/staffpicks/134668506')
    ).toEqual('https://player.vimeo.com/video/134668506');
    expect(
      convertUrlToEmbedUrl('vimeo.com/channels/staffpicks/134668506')
    ).toEqual('https://player.vimeo.com/video/134668506');

    expect(
      getVimeoIdFromUrl('vimeo.com/channels/staffpicks/134668506')
    ).toEqual('134668506');

    expect(getVimeoEmbedUrlFromId('134668506')).toEqual(
      'https://player.vimeo.com/video/134668506'
    );
  });

  it('youtube', () => {
    expect(
      convertUrlToEmbedUrl('https://www.youtube.com/watch?v=FTQbiNvZqaY')
    ).toEqual('https://www.youtube.com/embed/FTQbiNvZqaY');

    expect(convertUrlToEmbedUrl('https://youtu.be/FTQbiNvZqaY')).toEqual(
      'https://www.youtube.com/embed/FTQbiNvZqaY'
    );

    expect(convertUrlToEmbedUrl('youtu.be/FTQbiNvZqaY')).toEqual(
      'https://www.youtube.com/embed/FTQbiNvZqaY'
    );

    expect(getYouTubeIdFromUrl('youtu.be/FTQbiNvZqaY')).toEqual('FTQbiNvZqaY');

    expect(getYouTubeEmbedUrlFromId('FTQbiNvZqaY')).toEqual(
      'https://www.youtube.com/embed/FTQbiNvZqaY'
    );
  });
});
