import * as core from '@diffusionstudio/core';
import { Sprite, Assets } from 'pixi.js';

interface AlienClipProps extends core.ClipProps {
  speed?: number;
}

class AlienClip extends core.Clip<AlienClipProps> {
  public sprite = new Sprite();
  public speed = 50;

  public constructor(props: AlienClipProps = {}) {
    super();

    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(2);

    Object.assign(this, props);
    this.view.addChild(this.sprite);
  }

  public async init(): Promise<void> {
    this.sprite.texture = await Assets.load('https://pixijs.com/assets/flowerTop.png');
  }

  public enter(): void {

  }

  public update(time: core.Timestamp): void | Promise<void> {
    this.sprite.x = this.track!.composition!.width / 2;
    this.sprite.y = this.track!.composition!.height / 2;
    this.sprite.angle = time.millis * this.speed / 360;
  }

  public exit(): void {

  }
}

export async function main(composition: core.Composition) {
  await composition.add(new AlienClip({ speed: 80, stop: 150 }));
};
