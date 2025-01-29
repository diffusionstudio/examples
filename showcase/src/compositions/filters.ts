import * as core from '@diffusionstudio/core-v2';

export async function main(composition: core.Composition) {
  const source = await core.VideoSource
    .from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/big_buck_bunny_1080p_30fps.mp4');

  await composition.add(
    new core.VideoClip(source, {
      filter: 'contrast(1.4) sepia(1)',
    })
  );
};

