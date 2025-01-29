import * as core from '@diffusionstudio/core-v2';
import { Settings } from '../types';

export const settings: Settings = { height: 1920, width: 1080 };

export async function main(composition: core.Composition) {
  // fetch external resources
  const sources = await Promise.all([
    core.ImageSource.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/images/transparent_background.png'),
    core.Transcript.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/docs/ai_ft_coding_captions.json')
  ])

  // add a background image
  await composition.add(
    new core.ImageClip(sources[0], {
      duration: core.Timestamp.fromSeconds(22),
      rotation: 90,
      position: 'center',
    })
  );

  // MediaClip is the base of an Audio or Video Clip
  const media = new core.MediaClip({ transcript: sources[1].optimize() });

  const classic = new core.ClassicCaptionPreset({ position: { x: '50%', y: '10%' } });
  const cascade = new core.CascadeCaptionPreset({ position: { x: '10%', y: '20%' } });
  const guineaCaption = new core.GuineaCaptionPreset({ position: { x: '50%', y: '45%' } });
  const solarCaption = new core.SolarCaptionPreset({ position: { x: '50%', y: '65%' } });
  const whisperCaption = new core.WhisperCaptionPreset({ position: { x: '50%', y: '77%' } });
  const spotlight = new core.SpotlightCaptionPreset({ color: '#a436f7', position: { x: '50%', y: '90%' } });

  // Now let's add all available caption preset
  await composition.createTrack('caption')
    .from(media)
    .createCaptions(classic);

  await composition.createTrack('caption')
    .from(media)
    .createCaptions(cascade);

  await composition.createTrack('caption')
    .from(media)
    .createCaptions(guineaCaption);

  await composition.createTrack('caption')
    .from(media)
    .createCaptions(solarCaption);

  await composition.createTrack('caption')
    .from(media)
    .createCaptions(whisperCaption);

  await composition.createTrack('caption')
    .from(media)
    .createCaptions(spotlight);

  await composition.createTrack('caption')
    .from(media)
    .createCaptions(whisperCaption);
}
