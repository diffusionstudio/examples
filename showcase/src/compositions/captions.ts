import * as core from '@diffusionstudio/core';
import { Settings } from '../types';

export const settings: Settings = { height: 1440, width: 1920 };

export async function main(composition: core.Composition) {
  const transcript = await core.Transcript.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/docs/ai_ft_coding_captions.json');
  transcript.optimize();

  await composition.add(
    new core.VideoClip('/ocean_1920_1080_30fps.mp4', {
      height: '120%',
      position: 'center',
      filter: 'blur(20px)',
      muted: true,
      delay: '-6s',
    })
  )

  const classic = new core.ClassicCaptionPreset({ position: { x: '20%', y: '25%' } });
  const solarCaption = new core.SolarCaptionPreset({ position: { x: '50%', y: '12%' } });
  const paperCaption = new core.PaperCaptionPreset({ position: { x: '80%', y: '25%' } });
  const guineaCaption = new core.GuineaCaptionPreset({ position: { x: '25%', y: '50%' } });
  const spotlight = new core.SpotlightCaptionPreset({ color: '#12ccff', position: { x: '75%', y: '50%' } });
  const cascade = new core.CascadeCaptionPreset({ position: { x: '25%', y: '68%' } });
  const whisperCaption = new core.WhisperCaptionPreset({ position: { x: '75%', y: '88%' } });
  const verdant = new core.VerdantCaptionPreset({ position: { x: '30%', y: '90%' }, generatorOptions: { count: [4] } });


  // Now let's add all available caption preset
  await composition.createCaptions(transcript, classic);
  await composition.createCaptions(transcript, cascade);
  await composition.createCaptions(transcript, guineaCaption);
  await composition.createCaptions(transcript, solarCaption);
  await composition.createCaptions(transcript, spotlight);
  await composition.createCaptions(transcript, whisperCaption);
  await composition.createCaptions(transcript, verdant);
  await composition.createCaptions(transcript, paperCaption);

  composition.duration = '15s';
}
