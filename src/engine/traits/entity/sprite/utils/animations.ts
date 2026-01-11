import { game } from '../../../../core';
import type { Sprite } from '../sprite';
import { SpriteAnimationOptions, SpritesheetOptions } from '../types';

export class SpriteAnimations<
  TFrame extends string,
  TAnimation extends string
> {
  private state: TAnimation | null = null;
  private frameIndex: number | null = null;
  private done: (() => void) | null = null;

  constructor(
    private sprite: Sprite,
    private spritesheet?: SpritesheetOptions<TFrame, TAnimation>
  ) {}

  play(animation: TAnimation) {
    this.state = animation;
    this.frameIndex = 0;

    this.playNextFrame();
  }

  stop() {
    this.done?.();
    this.done = null;

    this.exitAnimation();

    this.state = null;
    this.frameIndex = null;
  }

  private getCurrentAnimation(): SpriteAnimationOptions<TFrame> {
    if (!this.spritesheet?.animations) {
      throw new Error('Sprite has no animations');
    }

    if (!this.state) {
      throw new Error('No animation is playing');
    }

    const options = this.spritesheet.animations[this.state];

    if (!options) {
      throw new Error(`Animation ${this.state} not found`);
    }

    return options;
  }

  private async playNextFrame() {
    const animation = this.getCurrentAnimation();

    if (!this.frameIndex) return;

    const { frames, repeat } = animation;
    const { frame, duration } = frames[this.frameIndex];

    this.sprite.set(frame);
    await game.wait(duration);
    this.frameIndex++;

    if (this.frameIndex === frames.length) {
      if (!repeat) return this.stop();

      this.frameIndex = 0;
    }

    await this.playNextFrame();
  }

  private exitAnimation() {
    const { returnToFrame } = this.getCurrentAnimation();

    if (returnToFrame) {
      return this.sprite.set(returnToFrame);
    }

    if (this.spritesheet?.defaultFrame) {
      return this.sprite.set(this.spritesheet.defaultFrame);
    }
  }
}
