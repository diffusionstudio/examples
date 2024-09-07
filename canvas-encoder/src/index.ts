import { buildGeometryFromPath, Container, GraphicsPath, Mesh, Texture, WebGLRenderer } from 'pixi.js';
import { CanvasEncoder, downloadObject } from '@diffusionstudio/core';

(async () => {
  // Create a new application
  const renderer = new WebGLRenderer();

  // Create root container
  const stage = new Container();

  // Initialize the application
  await renderer.init({
    backgroundColor: 'brown',
    height: 1080,
    width: 1920,
  });

  document.body.appendChild(renderer.canvas);

  const path = new GraphicsPath()
    .rect(-50, -50, 100, 100)
    .circle(80, 80, 50)
    .circle(80, -80, 50)
    .circle(-80, 80, 50)
    .circle(-80, -80, 50);

  const geometry = buildGeometryFromPath({
    path,
  });

  const meshes: Mesh[] = [];

  for (let i = 0; i < 200; i++) {
    const x = Math.random() * renderer.screen.width;
    const y = Math.random() * renderer.screen.height;

    const mesh = new Mesh({
      geometry,
      texture: Texture.WHITE,
      x,
      y,
      tint: Math.random() * 0xffffff,
    });

    stage.addChild(mesh);

    meshes.push(mesh);
  }

  // create new encoder with a framerate of 30FPS
  const encoder = new CanvasEncoder(renderer.canvas);

  for (let i = 0; i < 180; i++) {
    renderer.clear();
    // render to canvas
    renderer.render({ container: stage, clear: false });
    // encode current canvas state
    await encoder.encodeVideo();
    // animate
    meshes.forEach((mesh) => {
      mesh.rotation += 0.02;
    });
  }

  // optionally create audio buffer
  // using the WebAudio API
  const response = await fetch('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/audio/sfx/tada.mp3');
  const arrayBuffer = await response.arrayBuffer();
  const context = new OfflineAudioContext(1, 1, 48e3);
  const audioBuffer = await context.decodeAudioData(arrayBuffer);

  // encode audio buffer (sample rate will be adapted for you)
  await encoder.encodeAudio(audioBuffer);

  // finalize encoding/muxing and download result
  downloadObject(await encoder.export(), 'test.mp4');
})();
