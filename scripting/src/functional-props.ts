import * as core from '@diffusionstudio/core';

export async function main(composition: core.Composition) {
  const sources = await Promise.all([
    core.VideoSource.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/big_buck_bunny_1080p_30fps.mp4'),
    core.ImageSource.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/html/dvd_logo.svg')
  ]);

  await composition.add(new core.VideoClip(sources[0]));

  await composition.add(
    new core.ImageClip(sources[1], {
      x(this: core.TextClip, time: core.Timestamp) {
        const width = typeof this.width == 'number' ? this.width : 0;
        const range = composition.width - width;
        const x = (time.seconds * 500) % (range * 2);

        return x > range ? range * 2 - x : x;
      },
      y(this: core.TextClip, time: core.Timestamp) {
        const height = typeof this.height == 'number' ? this.height : 0;
        const range = composition.height - height;
        const y = (time.seconds * 200) % (range * 2);

        return y > range ? range * 2 - y : y;
      },
      stop: composition.duration,
    })
  );
};
