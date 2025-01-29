import puppeteer, { ElementHandle } from 'puppeteer';
import * as core from '@diffusionstudio/core-v2';
import fs from 'fs';

declare global {
  interface Window {
    core: typeof core;
    saveChunk(data: number[], position: number): void;
  }
}

async function main() {
  try {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    const file = fileInput.files?.[0]; // File object

    const composition = new core.Composition();

    const video = new core.VideoClip(file).subclip(0, 150);

    await composition.add(video);

    const encoder = new core.Encoder(composition, { debug: true });

    await encoder.render((data: Uint8Array, position: number) => {
      const uint8Array = new Uint8Array(data);
      const array = Array.from(uint8Array);
      // Pass the position along with the data
      window.saveChunk(array, position);
    });

    return 0;
  } catch (e) {
    return JSON.stringify({ message: e.message, stack: e.stack });
  }
}

// run function with puppeteer
async function run() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Forward browser console logs to Node.js console
  page.on('console', msg => {
    const msgType = msg.type(); // log, debug, error, info, warning
    const msgText = msg.text();

    // Forward the log to Node.js console
    if (msgType === 'error') {
      console.error(`[Browser] ${msgText}`);
    } else if (msgType === 'warn') {
      console.warn(`[Browser] ${msgText}`);
    } else {
      console.log(`[Browser] ${msgText}`);
    }
  });

  const fileSize = 1024 * 1024 * 100; // 100MB pre-allocation
  const fd = fs.openSync('./output.mp4', 'w');
  fs.ftruncateSync(fd, fileSize);
  fs.closeSync(fd);

  const writeStream = fs.createWriteStream('./output.mp4', { flags: 'r+' }) as fs.WriteStream & { fd: number };

  writeStream.on('error', (error) => {
    console.error('Error writing to file:', error);
  });

  await page.exposeFunction("saveChunk", async (data: number[], position: number) => {
    const uint8Array = new Uint8Array(data);
    fs.writeSync(writeStream.fd, uint8Array, 0, uint8Array.length, position);
  });

  // can be any https accessible page
  await page.goto('https://www.cloudflare.com/cdn-cgi/trace');

  // Inject required scripts
  await page.addScriptTag({ path: './node_modules/mp4-muxer/build/mp4-muxer.js' });
  await page.addScriptTag({ path: './node_modules/@diffusionstudio/core-v2/dist/core.umd.js' });

  await page.waitForFunction(() => typeof window.core !== 'undefined');
  await page.waitForFunction(() => typeof window.Mp4Muxer !== 'undefined');

  console.log('Scripts loaded');

  // Create an HTML file input element
  await page.setContent('<input type="file" id="fileInput">');

  // Select the file input element
  const input = await page.$('#fileInput') as ElementHandle<HTMLInputElement>;

  // Upload a local file
  await input.uploadFile('./big_buck_bunny_1080p_30fps.mp4');

  const res = await page.evaluate(main);

  console.log('res', res);

  writeStream.end();
  await browser.close();
};

run().catch(console.error);
