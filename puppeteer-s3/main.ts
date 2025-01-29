import puppeteer from 'puppeteer';
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as core from '@diffusionstudio/core-v2';

declare global {
  interface Window {
    core: typeof core;
  }
}

// Configure the AWS region and credentials
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  region: process.env.S3_REGION!,
});

// Function to generate a presigned URL
async function generatePresignedUrl() {
  const id = new Date().toISOString().split('.')[0];
  const bucketName = process.env.S3_BUCKET!;
  const objectKey = `${process.env.S3_FOLDER ?? 'output'}/video-${id}.mp4`;
  console.log('Generating presigned url for', objectKey);
  const expiresIn = 3600; // URL expiration time in seconds (1 hour)

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ContentType: 'video/mp4',
  });

  return await getSignedUrl(s3, command, { expiresIn });
};

async function main(presignedUrl: string) {
  try {
    const composition = new core.Composition();

    const source = await core.VideoSource
      .from('https://diffusion-studio-public.s3.eu-central-1.amazonaws.com/videos/big_buck_bunny_1080p_30fps.mp4');

    const video = new core.VideoClip(source)
      .subclip(0, 150);

    await composition.add(video);

    const encoder = new core.Encoder(composition);
    const blob = await encoder.render();

    if (!blob) {
      throw new Error('Failed to render video');
    }

    await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'video/mp4',
      },
      body: blob
    });

    return 'SUCCESS';
  } catch (e) {
    return String(e);
  }
}

// run function with puppeteer
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // can be any https accessible url
  await page.goto('https://www.cloudflare.com/cdn-cgi/trace');

  // Inject required scripts
  await page.addScriptTag({ path: './node_modules/mp4-muxer/build/mp4-muxer.js' });
  await page.addScriptTag({ path: './node_modules/@diffusionstudio/core-v2/dist/core.umd.js' });

  // Wait for both scripts to load
  await page.waitForFunction(() => typeof window.core !== 'undefined');
  await page.waitForFunction(() => typeof window.Mp4Muxer !== 'undefined');

  console.log('Loaded scripts');

  const presignedUrl = await generatePresignedUrl();

  console.log('Generated presigned url');

  const res = await page.evaluate(main, presignedUrl);

  console.log('res', res);
  await browser.close();
})();