import { ClipProps, Clip, Timestamp, Renderer } from '@diffusionstudio/core';
import type { Composition } from '@diffusionstudio/core';

// Define custom Clip properties extending `ClipProps`, such as start, stop, etc.
interface AlienClipProps extends ClipProps {
  speed?: number;  // Optional speed property
}

// Create a new class extending `Clip` and apply your custom properties
class AlienClip extends Clip {
  // Declare custom fields
  public speed = 0.2;
  public image = new Image();

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
  public override enter(): void {
    // No specific actions in this example, but can be used for one-time setup
  }

  // Update the clip's state on each frame. Receives a `Timestamp` argument.
  public override update(_renderer: Renderer, _time: Timestamp): void | Promise<void> {
    // This can be useful for computationally expensive operations.
  }

  public override render(renderer: Renderer, time: Timestamp): void {
    const x = this.track!.composition!.width / 2;
    const y = this.track!.composition!.height / 2;

    // Adjust the sprite's angle based on elapsed time and configured speed
    const angle = time.frames * this.speed;

    renderer.ctx.save();
    renderer.ctx.translate(x, y);
    renderer.ctx.rotate(angle);
    renderer.ctx.drawImage(this.image, -this.image.width / 2, -this.image.height / 2);
    renderer.ctx.restore();
  }

  // Exit phase: invoked when the clip is no longer needed
  public override exit(): void {
    // Cleanup resources (e.g., removing filters)
  }
}

export async function main(composition: Composition) {
  await composition.add(new AlienClip({ speed: 0.4, duration: 150 }));
};
