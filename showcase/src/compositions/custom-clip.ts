import * as core from '@diffusionstudio/core';

// Define custom Clip properties extending `ClipProps`, such as start, stop, etc.
interface AlienClipProps extends core.ClipProps {
  speed?: number;  // Optional speed property
}

// Create a new class extending `Clip` and apply your custom properties
class AlienClip extends core.Clip {
  // Declare custom fields
  public speed = 0.2;
  public image = new Image();

  private angle = 0;

  public constructor(props: AlienClipProps = {}) {
    // Ensure parent class `Clip` is properly initialized
    super(props);

    // Assign provided properties to the Clip instance
    Object.assign(this, props);
  }

  // Initialize the clip, typically used for loading assets asynchronously
  public override async init(): Promise<void> {
    this.image.crossOrigin = 'anonymous';
    this.image.src = 'https://pixijs.com/assets/flowerTop.png';
    await new Promise(resolve => this.image.onload = resolve);
  }

  // Enter phase: invoked when the clip is about to be drawn to the canvas
  public override async enter(): Promise<void> {
    // No specific actions in this example, but can be used for one-time setup
  }

  // Update the clip's state on each frame. Receives a `Timestamp` argument.
  public override async update(audio: core.AudioRenderer): Promise<void> {
    // This can be useful for computationally expensive operations.

    // Adjust the sprite's angle based on elapsed time and configured speed
    this.angle = audio.playbackFrame * this.speed;
  }

  public override render(video: core.VideoRenderer): void {
    const x = video.width / 2;
    const y = video.height / 2;

    video.context.save();
    video.context.translate(x, y);
    video.context.rotate(this.angle);
    video.context.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    video.context.restore();
  }

  // Exit phase: invoked when the clip is no longer needed
  public override async exit(): Promise<void> {
    // Cleanup resources (e.g., removing filters)
  }
}

export async function main(composition: core.Composition) {
  await composition.add(new AlienClip({ speed: 0.4, duration: 150 }));
};
