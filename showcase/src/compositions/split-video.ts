import * as core from '@diffusionstudio/core-v3';

export async function main(composition: core.Composition) {
  const video0 = await composition.add(
    new core.VideoClip('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/big_buck_bunny_1080p_30fps.mp4', {
      position: 'center',
      animations: [
        {
          key: 'scale',
          frames: [
            { time: 0, value: 0.1 },
            { time: '1s', value: 1 }
          ]
        },
        {
          key: 'rotation',
          frames: [
            { time: 0, value: 0 },
            { time: '1s', value: 360 }
          ]
        },
      ]
    })
  );

  // split at frame. If no argument is provided
  // the video will be split at the current
  // playback position (composition.frame)
  const video1 = await video0.split(300);

  // all keyframes were converted to their numeric
  // value at the time of the split, i.e. scale and rotation
  // are no longer key frames
  video1.animations = [
    {
      key: 'translateX',
      frames: [
        { value: composition.width, time: 0 },
        { value: 0, time: 10 }
      ]
    }
  ]
};
