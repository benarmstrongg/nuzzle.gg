import { TypeName } from '@pkmn/dex';
import { Entity, ISprite, Sprite } from '../../engine';
import { SpritesheetFrame } from '../../engine/traits/entity/sprite/types';

const assetUrl = 'spritesheets/type.png';
const spritesheetHeight = 532;
const w = 64;
const h = 28;

const frames: Record<TypeName, SpritesheetFrame> = {
  Normal: { x: 0, y: 0, w, h },
  Fighting: { x: 0, y: h, w, h },
  Flying: { x: 0, y: h * 2, w, h },
  Poison: { x: 0, y: h * 3, w, h },
  Ground: { x: 0, y: h * 4, w, h },
  Rock: { x: 0, y: h * 5, w, h },
  Bug: { x: 0, y: h * 6, w, h },
  Ghost: { x: 0, y: h * 7, w, h },
  Steel: { x: 0, y: h * 8, w, h },
  '???': { x: 0, y: h * 9, w, h },
  Fire: { x: 0, y: h * 10, w, h },
  Water: { x: 0, y: h * 11, w, h },
  Grass: { x: 0, y: h * 12, w, h },
  Electric: { x: 0, y: h * 13, w, h },
  Psychic: { x: 0, y: h * 14, w, h },
  Ice: { x: 0, y: h * 15, w, h },
  Dragon: { x: 0, y: h * 16, w, h },
  Dark: { x: 0, y: h * 17, w, h },
  Fairy: { x: 0, y: h * 18, w, h },
  Stellar: { x: 0, y: h * 19, w, h },
};

export class TypeIcon extends Entity implements ISprite {
  sprite: Sprite<TypeName>;

  constructor(type: TypeName) {
    super();

    this.sprite = new Sprite(this, {
      assetUrl,
      spritesheet: { frames, w, h: spritesheetHeight, defaultFrame: type },
    });
  }
}
