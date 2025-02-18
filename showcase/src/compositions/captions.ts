import * as core from '@diffusionstudio/core';
import { Settings } from '../types';

export const settings: Settings = { height: 1920, width: 1080 };

export async function main(composition: core.Composition) {
  const transcript = await core.Transcript.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/docs/ai_ft_coding_captions.json');
  transcript.optimize();

  // add a background image
  await composition.add(
    new core.ImageClip('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/images/transparent_background.png', {
      duration: '22s',
      rotation: 90,
      position: 'center',
    })
  );

  const classic = new core.ClassicCaptionPreset({ position: { x: '50%', y: '10%' } });
  const cascade = new core.CascadeCaptionPreset({ position: { x: '10%', y: '20%' } });
  const guineaCaption = new core.GuineaCaptionPreset({ position: { x: '50%', y: '45%' } });
  const solarCaption = new core.SolarCaptionPreset({ position: { x: '50%', y: '65%' } });
  const whisperCaption = new core.WhisperCaptionPreset({ position: { x: '50%', y: '77%' } });
  const spotlight = new core.SpotlightCaptionPreset({ color: '#a436f7', position: { x: '50%', y: '90%' } });

  // Now let's add all available caption preset
  await composition.createCaptions(transcript, classic);
  await composition.createCaptions(transcript, cascade);
  await composition.createCaptions(transcript, guineaCaption);
  await composition.createCaptions(transcript, solarCaption);
  await composition.createCaptions(transcript, whisperCaption);
  await composition.createCaptions(transcript, spotlight);
}
