import * as core from '@diffusionstudio/core-v3';

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
const video = await core.Source.from<core.VideoSource>('/drone_footage_1080p_25fps.mp4');

// limit composition duration to video duration
const duration = video.duration?.frames ?? 0; // original duration
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
          { time: 0, value: 243,  },
          { time: '0.5s', value: 720, }
        ]
      }, {
        key: 'translateX',
        frames: [
          { time: duration - 20, value: 0,  },
          { time: duration, value: -2000,  }
        ]
      }, {
        key: 'scale',
        frames: [
          { time: 0, value: 0.3,  },
          { time: 10, value: 1,  }
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
