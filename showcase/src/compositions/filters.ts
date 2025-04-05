import * as core from '@diffusionstudio/core';

export async function main(composition: core.Composition) {
  const source = await core.Source.from<core.VideoSource>(
    'https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/big_buck_bunny_1080p_30fps.mp4',
    { prefetch: true }
  );
  await composition.add(
    new core.VideoClip(source, {
      filter: 'contrast(1.4) sepia(1)',
    })
  );
};
