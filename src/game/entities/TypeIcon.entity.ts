import { Entity, ISprite, Sprite } from '../../engine';
import { SpritesheetFrame } from '../../engine/traits/entity/sprite/types';
import { TypeId } from '../types';

const assetUrl = 'spritesheets/type.png';
const spritesheetHeight = 532;
const w = 64;
const h = 28;

const frames: Record<TypeId, SpritesheetFrame> = {
  normal: { x: 0, y: 0, w, h },
  fighting: { x: 0, y: h, w, h },
  flying: { x: 0, y: h * 2, w, h },
  poison: { x: 0, y: h * 3, w, h },
  ground: { x: 0, y: h * 4, w, h },
  rock: { x: 0, y: h * 5, w, h },
  bug: { x: 0, y: h * 6, w, h },
  ghost: { x: 0, y: h * 7, w, h },
  steel: { x: 0, y: h * 8, w, h },
  '???': { x: 0, y: h * 9, w, h },
  fire: { x: 0, y: h * 10, w, h },
  water: { x: 0, y: h * 11, w, h },
  grass: { x: 0, y: h * 12, w, h },
  electric: { x: 0, y: h * 13, w, h },
  psychic: { x: 0, y: h * 14, w, h },
  ice: { x: 0, y: h * 15, w, h },
  dragon: { x: 0, y: h * 16, w, h },
  dark: { x: 0, y: h * 17, w, h },
  fairy: { x: 0, y: h * 18, w, h },
};

export class TypeIcon extends Entity implements ISprite {
  sprite: Sprite<TypeId>;

  constructor(type: TypeId) {
    super();

    this.sprite = new Sprite(this, {
      assetUrl,
      spritesheet: { frames, w, h: spritesheetHeight, initialFrame: type },
    });
  }
}
