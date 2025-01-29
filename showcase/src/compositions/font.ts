import * as core from '@diffusionstudio/core-v2';

export async function main(composition: core.Composition) {
  const manager = new core.FontManager();
  const video = await composition.add(
    new core.VideoClip(
      await core.VideoSource
        .from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/drone_footage_1080p_25fps.mp4')
    )
  );

  const duration = video.duration.frames;
  composition.duration = duration;

  await composition.add(
    new core.TextClip({
      text: 'Hello World',
      position: 'center', // use one of the default fonts
      font: await manager.load({ family: 'The Bold Font', weight: '500' }),
      fontSize: 34,
      align: 'center',
      baseline: 'middle',
      animations: [{
        key: 'rotation',
        frames: [
          { value: 243, frame: 0 },
          { value: 360 * 2, frame: 15 }
        ]
      }, {
        key: 'translateX',
        frames: [
          { value: 0, frame: duration - 20 },
          { value: -2000, frame: duration }
        ]
      }, {
        key: 'scale',
        frames: [
          { value: 0.3, frame: 0 },
          { value: 1, frame: 10 }
        ]
      }]
    })
  );

  // provide custom web font. Local font strings are also supported
  // e.g. source: 'local('FlamboyantSansSerif')'
  // https://developer.chrome.com/docs/capabilities/web-apis/local-fonts
  const roboto = await manager.load({
    source: "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2",
    weight: '400',
    family: 'Roboto'
  });

  await composition.add(
    new core.TextClip({
      text: 'Diffusion Studio',
      align: 'right',
      baseline: 'bottom',
      font: roboto,
      fontSize: 9,
      x: '95%',
      y: '93%'
    })
  );

  await composition.add(
    new core.TextClip({
      text: 'August 2024',
      align: 'right',
      baseline: 'top',
      color: '#000000',
      font: roboto,
      fontSize: 9,
      x: '95%',
      y: '7%'
    })
  );
};
