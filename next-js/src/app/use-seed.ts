import * as core from "@diffusionstudio/core";
import { useContext, useEffect, useState } from "react";
import { CompositionContext } from "./context";

export function useSeed() {
  const { composition } = useContext(CompositionContext);
  const [populated, setPopulated] = useState(false);

  useEffect(() => {
    if (!composition) return;

    seed(composition).then(() => setPopulated(true));
  }, [composition]);

  return populated;
}

async function seed(composition: core.Composition) {
  const manager = new core.FontManager();

  const video = await composition.add(
    new core.VideoClip(
      await core.VideoSource
        .from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/drone_footage_1080p_25fps.mp4')
    )
  );

  const boldfont = await manager.load({ family: 'The Bold Font', weight: '500' });
  const figtree = await manager.load({ family: 'Figtree', weight: '400' });
  const duration = video.duration.frames;
  composition.duration = duration;

  await composition.add(
    new core.TextClip({
      text: 'Hello World',
      position: 'center', // use one of the default fonts
      font: boldfont,
      fontSize: 34,
      align: 'center',
      baseline: 'middle',
      animations: [{
        key: 'rotation',
        frames: [
          { frame: 0, value: 243 },
          { frame: 15, value: 360 * 2 },
        ]
      }, {
        key: 'translateX',
        frames: [
          { frame: duration - 10, value: 0 },
          { frame: duration, value: -2000 },
        ]
      }, {
        key: 'scale',
        frames: [
          { frame: 0, value: 0.3 },
          { frame: 10, value: 1 },
        ]
      }]
    })
  );

  await composition.add(
    new core.TextClip({
      text: 'Diffusion Studio',
      align: 'right',
      baseline: 'bottom',
      font: figtree,
      fontSize: 9,
      x: '95%',
      y: '93%'
    })
  );

  await composition.add(
    new core.TextClip({
      text: 'January 2025',
      align: 'right',
      baseline: 'top',
      color: '#000000',
      font: figtree,
      fontSize: 9,
      x: '95%',
      y: '7%'
    })
  );
}
