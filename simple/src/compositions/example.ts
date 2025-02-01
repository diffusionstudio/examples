import * as core from '@diffusionstudio/core';

export const composition = new core.Composition();

const manager = new core.FontManager();

// default font
const boldFont = await manager.load({ 
  family: 'The Bold Font', 
  weight: '500',
});

// provide custom web font. Local font strings are also supported
// e.g. source: 'local('FlamboyantSansSerif')'
// https://developer.chrome.com/docs/capabilities/web-apis/local-fonts
const roboto = await manager.load({
  source: "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2",
  weight: '400',
  family: 'Roboto'
});

// fetch video asset
const video = await core.VideoSource.from('/drone_footage_1080p_25fps.mp4');

// limit composition duration to video duration
const duration = video.duration.frames; // original duration
composition.duration = duration;

// add a background video
await composition.add(new core.VideoClip(video));

// add a text clip and animate it
await composition.add(
  new core.TextClip({
    text: 'Hello World',
      position: 'center', // use one of the default fonts
      font: boldFont,
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
