import { Entity } from '../entity';
import { Sprite } from './sprite';
import { SpriteOptions } from './types';

type SpriteFactory = (<TFrame extends string, TAnimation extends string>(
  options: SpriteOptions<TFrame, TAnimation>
) => Entity.Sprite) & {
  // empty: (
  //   options?: Omit<SpriteOptions<never, never>, 'assetUrl' | 'spritesheet'>
  // ) => Entity.Sprite;
};

export const spriteFactory: SpriteFactory = (options) => {
  return new (class extends Entity.Sprite {
    sprite = new Sprite(this, options);
  })();
};
