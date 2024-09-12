import { Composition, VideoClip, VideoSource, TextClip, Font, Keyframe } from '@diffusionstudio/core';

export const composition = new Composition();

// default font
const boldFont = Font.fromFamily({ family: 'The Bold Font', weight: '500' });

// provide custom web font. Local font strings are also supported
// e.g. source: 'local('FlamboyantSansSerif')'
// https://developer.chrome.com/docs/capabilities/web-apis/local-fonts
const roboto = new Font({
  source: "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2",
  weight: '400',
  family: 'Roboto'
});

// fetch video asset
const video = await VideoSource.from('/drone_footage_1080p_25fps.mp4');

// add a background video
const clip = await composition.add(new VideoClip(video));

// add a text clip and animate it
await composition.add(
  new TextClip({
    text: 'Hello World',
    position: 'center',
    font: boldFont,
    rotation: new Keyframe(
      [0, 15],
      [243, 360 * 2]
    ),
    translate: {
      x: new Keyframe(
        [clip.duration.frames - 10, clip.duration.frames],
        [0, -2000],
        { easing: 'easeIn' }
      ),
      y: 0,
    },
    scale: new Keyframe([0, 10], [0.3, 1]),
    fontSize: 34
  })
);

await composition.add(
  new TextClip({
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
  new TextClip({
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

// limit composition duration to video duration
composition.duration = clip.duration.frames;
