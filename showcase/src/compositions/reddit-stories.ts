import * as core from '@diffusionstudio/core-v3';
import { Settings } from '../types';

export const settings: Settings = { height: 1920, width: 1080 };

export async function main(composition: core.Composition) {
  const transcript = await core.Transcript.from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/docs/ai_ft_coding_captions.json');
  const html = await core.Source.from<core.HtmlSource>('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/html/question_and_answer_card.html');

  // remove line to see the difference
  transcript.optimize();

  // Get the first scentence of the transcript (question)
  const question = transcript.groups[0];

  // manipulate html source to manipulate title
  // the HtmlSource uses an Iframe in the background
  html.document!.getElementById('title')!.textContent = question.text;

  // add the Video, make sure it centered
  await composition.add(
    new core.VideoClip('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/minecraft_parkour_1080p.mp4', {
      muted: true,
      position: 'center',
      height: '100%'
    })
  );

  // the html should be centered and hide when the 
  // question ends. Let's also apply some animations...
  await composition.add(
    new core.HtmlClip(html, {
      position: 'center',
      duration: question.stop,
      animations: [
        {
          key: 'scale',
          frames: [
            { time: 0, value: 0.7 },
            { time: 9, value: 1 }
          ],
          easing: 'ease-out',
        }, {
          key: 'translateY',
          frames: [
            { time: 0, value: 14 },
            { time: 9, value: 0 }
          ],
          easing: 'ease-out',
        }
      ]
    })
  );
  // the transcript will be added to the audio for later use
  const audio = await composition.add(
    new core.AudioClip('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/audio/elevenlabs_44100.mp3', {
      transcript
    })
  );

  // Create a new caption track
  const captions = await composition.createCaptions(audio, core.GuineaCaptionPreset);

  // hide all clips as long as the html card is visible
  for (const clip of captions.clips) {
    if (clip.stop.frames <= question.stop.frames) {
      clip.disabled = true;
    }
  }

  // set a duration limit
  composition.duration = audio.duration;
};
