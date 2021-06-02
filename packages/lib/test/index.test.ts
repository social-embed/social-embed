import {
  convertUrlToEmbedUrl,
  getDailyMotionEmbedFromId,
  getDailyMotionIdFromUrl,
  getEdPuzzleIdFromUrl,
  getEdPuzzleEmbedUrlFromId,
  getLoomIdFromUrl,
  getLoomEmbedUrlFromId,
  getVimeoEmbedUrlFromId,
  getVimeoIdFromUrl,
  getWistiaIdFromUrl,
  getWistiaEmbedUrlFromId,
  getYouTubeEmbedUrlFromId,
  getYouTubeIdFromUrl,
  genericUrlRegex,
  isValidUrl,
} from '../src';

describe('convertUrlToEmbedUrl', () => {
  it('is defined', () => {
    expect(convertUrlToEmbedUrl.name).toEqual('convertUrlToEmbedUrl');
  });

  it('generic', () => {
    const urlPatterns = [
      'https://apple.com',
      'https://open.spotify.com',
      'https://www.anotherdomainname.com?with=GETPARAMS#andAFragment',
    ];

    for (let i = 0; i < urlPatterns.length; i++) {
      const url = urlPatterns[i];
      expect(url).toMatch(genericUrlRegex);
      expect(isValidUrl(url)).toEqual(true);
    }

    const urlIgnorePatterns = ['notaurl'];
    for (let i = 0; i < urlIgnorePatterns.length; i++) {
      const url = urlIgnorePatterns[i];
      expect(url).not.toMatch(genericUrlRegex);
      expect(isValidUrl(url)).not.toEqual(true);
    }
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

  it('loom', () => {
    const loomId = 'e883f70b219a49f6ba7fbeac71a72604';
    const expectedEmbeddableUrl = `https://www.loom.com/embed/${loomId}`;
    expect(
      convertUrlToEmbedUrl(
        'https://www.loom.com/share/e883f70b219a49f6ba7fbeac71a72604'
      )
    ).toEqual(expectedEmbeddableUrl);

    expect(
      convertUrlToEmbedUrl(
        'https://loom.com/share/e883f70b219a49f6ba7fbeac71a72604'
      )
    ).toEqual(expectedEmbeddableUrl);

    expect(
      convertUrlToEmbedUrl('loom.com/share/e883f70b219a49f6ba7fbeac71a72604')
    ).toEqual(expectedEmbeddableUrl);

    expect(
      getLoomIdFromUrl('loom.com/share/e883f70b219a49f6ba7fbeac71a72604')
    ).toEqual(loomId);

    expect(getLoomEmbedUrlFromId(loomId)).toEqual(expectedEmbeddableUrl);
  });

  it('edpuzzle', () => {
    const edPuzzleId = `606b413369971e424ec6021e`;
    const expectedEmbeddableUrl = `https://edpuzzle.com/embed/media/${edPuzzleId}`;

    expect(
      convertUrlToEmbedUrl(
        'https://edpuzzle.com/media/606b413369971e424ec6021e'
      )
    ).toEqual(expectedEmbeddableUrl);

    expect(
      convertUrlToEmbedUrl(
        'https://www.edpuzzle.com/media/606b413369971e424ec6021e'
      )
    ).toEqual(expectedEmbeddableUrl);

    expect(
      convertUrlToEmbedUrl('edpuzzle.com/media/606b413369971e424ec6021e')
    ).toEqual(expectedEmbeddableUrl);

    expect(
      getEdPuzzleIdFromUrl('edpuzzle.com/media/606b413369971e424ec6021e')
    ).toEqual(edPuzzleId);

    expect(getEdPuzzleEmbedUrlFromId(edPuzzleId)).toEqual(
      expectedEmbeddableUrl
    );
  });

  it('wistia', () => {
    const wistiaId = `26sk4lmiix`;
    const expectedEmbeddableUrl = `https://fast.wistia.net/embed/iframe/${wistiaId}`;

    expect(
      convertUrlToEmbedUrl('https://support.wistia.com/medias/26sk4lmiix')
    ).toEqual(expectedEmbeddableUrl);

    expect(
      convertUrlToEmbedUrl('https://support.wistia.com/embed/26sk4lmiix')
    ).toEqual(expectedEmbeddableUrl);

    // wi.st isn't integration yet, but may be in the future (https://wistia.com/support/developers/construct-an-embed-code)
    expect(
      convertUrlToEmbedUrl('https://support.wi.st/medias/26sk4lmiix')
    ).toEqual(expectedEmbeddableUrl);

    expect(
      convertUrlToEmbedUrl('https://support.wi.st/embed/26sk4lmiix')
    ).toEqual(expectedEmbeddableUrl);

    expect(getWistiaIdFromUrl('support.wistia.com/embed/26sk4lmiix')).toEqual(
      wistiaId
    );

    expect(
      getWistiaIdFromUrl('https://support.wi.st/medias/26sk4lmiix')
    ).toEqual(wistiaId);

    expect(getWistiaEmbedUrlFromId(wistiaId)).toEqual(expectedEmbeddableUrl);
  });
});
