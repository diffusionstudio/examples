import * as core from '@diffusionstudio/core-v3';
import { setupControls } from './controls';
import { setupTimeline } from './timeline';

const composition = new core.Composition();

// define configuration
const height = 720;
const gap = 50;
const radius = 15;
const shadow = 'drop-shadow(4px 6px 30px rgba(0, 0, 0, 0.4))';

const videoWidth = height * 16 / 9;
const avatarWidth = height * 9 / 16;

const videoX = (composition.width - videoWidth - avatarWidth - gap) * 0.5;
const avatarX = videoX + videoWidth + gap;

const y = (composition.height - height) * 0.5;

const videoSource = await core.Source.from<core.VideoSource>('/latentsync_predicition.mp4');

await composition.add(
  new core.ImageClip('/raycast_moonrise.png', {
    height: '100%',
    duration: videoSource.duration,
  })
);

await composition.add(
  new core.RectangleClip({
    height: height,
    width: videoWidth,
    x: videoX,
    y,
    radius,
    filter: shadow,
    fill: '#000',
  })
);

const videoMask = new core.RectangleMask({
  height: height,
  width: videoWidth,
  x: videoX,
  y,
  radius,
});

await composition.add(
  new core.VideoClip('/carrio_code_ocamel.mp4', {
    height: height,
    x: videoX,
    y,
    duration: videoSource.duration,
    mask: videoMask,
  })
);

await composition.add(
  new core.RectangleClip({
    height: height,
    width: avatarWidth,
    x: avatarX,
    y,
    radius,
    filter: shadow,
    fill: '#000',
  })
);

const avatarMask = new core.RectangleMask({
  height: height,
  width: avatarWidth,
  x: avatarX,
  y,
  radius,
});

await composition.add(
  new core.VideoClip('/latentsync_predicition.mp4', {
    height: height,
    x: avatarX,
    y,
    muted: true,
    mask: avatarMask,
  })
);

// connect to ui
setupControls(composition);
setupTimeline(composition);
