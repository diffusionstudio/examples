import * as core from '@diffusionstudio/core';

export async function main(composition: core.Composition) {
  const video = await composition.add(
    new core.VideoClip(
      await core.VideoSource
        .from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/drone_footage_1080p_25fps.mp4')
    )
  );

  const duration = video.duration.frames;
  composition.duration = duration;

  const text = await composition.add(
    new core.TextClip({
      text: 'Hello World',
      position: 'center', // use one of the default fonts
      font: core.Font.fromFamily({ family: 'The Bold Font', weight: '500' }),
      fontSize: 34
    })
  );

  text.animate()
    .rotation(243).to(360 * 2, 15)
    .translateX(0, duration - 20, 'easeIn').to(-2000, 10)
    .scale(0.3).to(1, 10)

  // provide custom web font. Local font strings are also supported
  // e.g. source: 'local('FlamboyantSansSerif')'
  // https://developer.chrome.com/docs/capabilities/web-apis/local-fonts
  const roboto = new core.Font({
    source: "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2",
    weight: '400',
    family: 'Roboto'
  });

  await composition.add(
    new core.TextClip({
      text: 'Diffusion Studio',
      textAlign: 'right',
      textBaseline: 'bottom',
      font: roboto,
      fontSize: 9,
      x: '95%',
      y: '93%'
    })
  );

  await composition.add(
    new core.TextClip({
      text: 'August 2024',
      textAlign: 'right',
      textBaseline: 'top',
      fillStyle: '#000000',
      font: roboto,
      fontSize: 9,
      x: '95%',
      y: '7%'
    })
  );
};
