import * as core from '@diffusionstudio/core';
import { Settings } from '../types';

export const settings: Settings = { height: 1920, width: 1080 };

export async function main(composition: core.Composition) {
  const sources = await Promise.all([
    core.Source.from<core.VideoSource>('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/minecraft_parkour_1080p_light.mp4'),
    core.Source.from<core.AudioSource>('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/audio/elevenlabs_44100.mp3'),
    core.Transcript.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/docs/ai_ft_coding_captions.json'),
  ]);

  await composition.add(
    new core.VideoClip(sources[0], {
      muted: true,
      position: 'center',
      height: '100%'
    })
  );

  const audio = await composition.add(
    new core.AudioClip(sources[1], { transcript: sources[2] })
  );

  /**
   * Default Tiktok captions clone
   */
  class TikTokCaptionPreset extends core.CaptionPreset {
    // this is the required function that gets an empty track
    // and appends the text or complex text clips
    public async apply(layer: core.Layer, transcript: core.Transcript, offset: core.Timestamp): Promise<void> {
      const font = await core.FontManager.load({ family: 'Montserrat', weight: '500' });

      // iter accepts the config parameters count, duration, length
      // count: determines the number of words in a group
      // duration: determines the duration of a group
      // length: determines the number of characters in a group
      // use a range of values to randomize the output e.g. [2, 6]
      for (const words of transcript.iter({ duration: [3] })) {
        await layer.add(
          new core.TextClip({
            text: words.text,
            delay: words.start.add(offset),
            duration: words.duration,
            font,
            align: 'center',
            fontSize: 19,
            stroke: {
              width: 5,
            },
            shadow: {
              color: '#000000',
              opacity: 0.9,
              blur: 8,
              offsetX: 2,
              offsetY: 2,
            },
            position: {
              x: '50%',
              y: '70%',
            },
            maxWidth: 700,
          })
        );
      }
    }
  }

  await composition.createCaptions(audio,
    new TikTokCaptionPreset({
      position: { x: '50%', y: '70%' }
    })
  );

  composition.duration = audio.duration;
}
