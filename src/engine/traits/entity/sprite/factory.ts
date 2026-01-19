import { Entity } from '../../../core';
import { ISprite, Sprite, SpriteOptions } from './sprite';

type SpriteFactory = <TFrame extends string, TAnimation extends string>(
  options: SpriteOptions<TFrame, TAnimation>
) => Entity & ISprite;

export const spriteFactory: SpriteFactory = (options) => {
  return new (class extends Entity implements ISprite {
    sprite = new Sprite(this, options);
  })();
};
