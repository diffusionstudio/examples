
import * as core from '@diffusionstudio/core';

// keep fps in memory
let fps = 30;

/**
 * Export the provided composition
 * @param composition The composition to render
 */
export async function render(composition: core.Composition) {
  if (loader.style.display != 'none') return;

  try {
    const encoder = new core.Encoder(composition, { debug: true, video: { fps } });

    // display the progress
    encoder.on('render', (event) => {
      const { progress, total } = event.detail;
      container.style.display = 'flex';
      text.innerHTML = `${Math.round(progress * 100 / total)}%`;
    })

    await encoder.render('video.mp4');
  } catch (e) {
    if (e instanceof DOMException) {
      // user canceled file picker
    } else if (e instanceof core.EncoderError) {
      // diffusion studio error
      alert(e.message);
    } else {
      // unexpected error
      alert(String(e))
    }
  } finally {
    loader.style.display = 'none';
    container.style.display = 'none';
  }
}

// query the required elements
const container = document.querySelector('[id="progress"]') as HTMLDivElement;
const text = document.querySelector('[id="progress"] > h1') as HTMLHeadingElement;
const loader = document.querySelector('.loader') as HTMLDivElement;
const fpsButton = document.querySelector('[data-lucide="sliders-vertical"]') as HTMLElement;

// handle framerate configuration
fpsButton.addEventListener('click', () => {
  const value = parseFloat(
    prompt("Please enter the desired render frame rate", fps.toString()) ?? fps.toString()
  );

  if (!Number.isNaN(value)) fps = value
});
