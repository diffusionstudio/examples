import * as core from '@diffusionstudio/core-v2';
import { Settings } from '../types';

export const settings: Settings = { height: 1920, width: 1080 };

export async function main(composition: core.Composition) {
  // Fetch all resources in parallel
  const sources = await Promise.all([
    core.VideoSource.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/minecraft_parkour_1080p_light.mp4'),
    core.AudioSource.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/audio/elevenlabs_44100.mp3'),
    core.HtmlSource.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/html/question_and_answer_card.html'),
    core.Transcript.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/docs/ai_ft_coding_captions.json'),
  ]);

  // remove line to see the difference
  sources[3].optimize();

  // Get the first scentence of the transcript (question)
  const question = sources[3].groups[0];

  // manipulate html source to manipulate title
  // the HtmlSource uses an Iframe in the background
  sources[2].document!.getElementById('title')!.textContent = question.text;

  // add the Video, make sure it centered
  await composition.add(
    new core.VideoClip(sources[0], {
      muted: true,
      position: 'center',
      height: '100%'
    })
  );

  // the html should be centered and hide when the 
  // question ends. Let's also apply some animations...
  await composition.add(
    new core.HtmlClip(sources[2], {
      position: 'center',
      duration: question.stop,
      animations: [
        {
          key: 'scale',
          frames: [
            { value: 0.7, frame: 0 },
            { value: 1, frame: 9 }
          ],
          easing: 'ease-out',
        }, {
          key: 'translateY',
          frames: [
            { value: 14, frame: 0 },
            { value: 0, frame: 9 }
          ],
          easing: 'ease-out',
        }
      ]
    })
  );
  // the transcript will be added to the audio for later use
  const audio = await composition.add(
    new core.AudioClip(sources[1], {
      transcript: sources[3]
    })
  );

  // Create a new caption track
  const captions = await audio.createCaptions(core.GuineaCaptionPreset);

  // hide all clips as long as the html card is visible
  for (const clip of captions.clips) {
    if (clip.stop.frames <= question.stop.frames) {
      clip.disabled = true;
    }
  }

  // set a duration limit
  composition.duration = audio.duration;
};
