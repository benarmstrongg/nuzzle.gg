import { Entity } from '../entity';
import { Sprite, SpriteOptions } from './sprite';

type SpriteFactory = <TFrame extends string, TAnimation extends string>(
  options: SpriteOptions<TFrame, TAnimation>
) => Entity.Sprite;

export const spriteFactory: SpriteFactory = (options) => {
  return new (class extends Entity.Sprite {
    sprite = new Sprite(this, options);
  })();
};
