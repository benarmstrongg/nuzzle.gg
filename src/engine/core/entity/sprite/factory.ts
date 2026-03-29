import { Entity } from "../entity";
import { Sprite, SpriteOptions } from "./sprite";

export const spriteFactory = <TFrame extends string, TAnimation extends string>(
  options: SpriteOptions<TFrame, TAnimation>
): Entity.Sprite => {
  return new (class extends Entity.Sprite {
    sprite = new Sprite<TFrame, TAnimation>(this, options);
  })();
}