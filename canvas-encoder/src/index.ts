import { CanvasEncoder, downloadObject } from '@diffusionstudio/core';

// Make sure to assign video dimensions
const canvas = new OffscreenCanvas(1920, 1080);

const encoder = new CanvasEncoder(canvas, { audio: true });

const ctx = canvas.getContext("2d")!;

for (let i = 0; i < 90; i++) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // background
  ctx.fillStyle = "blue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // text
  ctx.fillStyle = "white";
  ctx.font = "50px serif"; // animated Hello World
  ctx.fillText("Hello world", 10 + i * 20, 10 + i * 12);

  // Encode the current canvas state
  await encoder.encodeVideo();
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
downloadObject(await encoder.blob(), 'test.mp4');
