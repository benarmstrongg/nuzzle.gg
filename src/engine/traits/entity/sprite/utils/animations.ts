import { AnimatedSprite as PixiAnimatedSprite } from 'pixi.js';
import type { Sprite } from '../sprite';
import { SpriteAnimationOptions, SpritesheetOptions } from '../types';
import { SpriteLoader } from './loader';

export class SpriteAnimations<
  TFrame extends string,
  TAnimation extends string
> {
  private state: TAnimation | null = null;

  constructor(
    private sprite: Sprite,
    private inner: PixiAnimatedSprite,
    private loader: SpriteLoader<TFrame, TAnimation>,
    private spritesheet?: SpritesheetOptions<TFrame, TAnimation>
  ) {}

  play(animation: TAnimation) {
    if (this.state === animation) return;

    console.log(`playing animation ${animation}`);
    const { frames } = this.spritesheet!.animations![animation];
    const textures = frames.map((frame) => this.loader.textures![frame.frame]);
    this.inner.textures = textures;
    this.inner.animationSpeed = 0.08;
    this.inner.play();
    this.state = animation;
  }

  stop() {
    this.inner.stop();
    this.exitAnimation();
    this.state = null;
  }

  private getCurrentAnimation(): SpriteAnimationOptions<TFrame> | null {
    if (!this.spritesheet?.animations) {
      throw new Error('Sprite has no animations');
    }

    if (!this.state) {
      return null;
    }

    const options = this.spritesheet.animations[this.state];

    if (!options) {
      throw new Error(`Animation ${this.state} not found`);
    }

    return options;
  }

  private exitAnimation() {
    const animation = this.getCurrentAnimation();

    if (!animation) return;

    const { returnToFrame } = animation;

    if (returnToFrame) {
      return this.sprite.set(returnToFrame);
    }

    if (this.spritesheet?.defaultFrame) {
      return this.sprite.set(this.spritesheet.defaultFrame);
    }
  }
}
