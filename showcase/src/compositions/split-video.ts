import * as core from '@diffusionstudio/core';

export async function main(composition: core.Composition) {
  const source = await core.VideoSource.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/big_buck_bunny_1080p_30fps.mp4');

  const video0 = await composition.add(
    new core.VideoClip(source, { position: 'center' })
  );

  video0.animate()
    .scale(0.1, 0, 'easeOut').to(1, 30)
    .rotation(0, 0, 'easeOut').to(360, 30)
    .translateX(0, 290).to(-composition.width, 10);

  // split at frame. If no argument is provided
  // the video will be split at the current
  // playback position (composition.frame)
  const video1 = await video0.split(300);

  // all keyframes were converted to their numeric
  // value at the time of the split, i.e. scale and rotation
  // are no longer key frames
  video1.animate()
    .translateX(composition.width).to(0, 10);
};
