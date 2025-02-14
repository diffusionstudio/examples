import * as core from '@diffusionstudio/core-v3';

export async function main(composition: core.Composition) {
  const source = await core.Source
    .from<core.VideoSource>('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/big_buck_bunny_1080p_30fps.mp4');

  const font = await core.FontManager.load({
    family: 'Geologica',
    weight: '400',
    size: 12
  });

  // Let's limit the composition duration to 19 seconds
  composition.duration = new core.Timestamp(0, 19);

  await composition.add(
    new core.VideoClip(source, {
      scale: 0.5,
      muted: true,
      x: '0%',
      y: '0%'
    })
  );

  await composition.add(
    new core.TextClip({
      text: 'Cut by composition duration',
      align: 'center',
      baseline: 'middle',
      font,
      stroke: { color: '#000000' },
      x: '25%',
      y: '25%',
    })
  );

  await composition.add(
    new core.VideoClip(source, {
      scale: 0.5,
      muted: true,
      x: '50%',
      y: '0%'
    })
      .subclip(30, composition.duration.frames - 60)
  );

  await composition.add(
    new core.TextClip({
      text: 'Trimmed start and stop',
      align: 'center',
      baseline: 'middle',
      font,
      stroke: { color: '#000000' },
      x: '75%',
      y: '25%',
    })
  );

  await composition.add(
    new core.VideoClip(source, {
      scale: 0.5,
      muted: true,
      x: '0%',
      y: '50%',
    })
      .offset(-60)
  );

  await composition.add(
    new core.TextClip({
      text: 'Negative offset',
      align: 'center',
      baseline: 'middle',
      font,
      stroke: { color: '#000000' },
      x: '25%',
      y: '75%',
    })
  );

  await composition.add(
    new core.VideoClip(source, {
      scale: 0.5,
      muted: true,
      x: '50%',
      y: '50%',
    })
      .offset(60)
      .subclip(30, composition.duration.frames - 180)

  );

  await composition.add(
    new core.TextClip({
      text: 'Positive offset & Trim',
      align: 'center',
      baseline: 'middle',
      font,
      stroke: { color: '#000000' },
      x: '75%',
      y: '75%',
    })
  );
};
