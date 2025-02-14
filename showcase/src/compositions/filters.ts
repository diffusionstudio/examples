import * as core from '@diffusionstudio/core-v3';

export async function main(composition: core.Composition) {
  await composition.add(
    new core.VideoClip('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/big_buck_bunny_1080p_30fps.mp4', {
      filter: 'contrast(1.4) sepia(1)',
    })
  );
};
