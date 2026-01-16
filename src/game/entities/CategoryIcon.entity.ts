import { Entity, ISprite, Sprite } from '../../engine';
import { SpritesheetFrame } from '../../engine/traits/entity/sprite/types';
import { MoveCategoryId } from '../types/moves.types';

const assetUrl = 'spritesheets/category.png';
const spritesheetHeight = 532;
const w = 64;
const h = 28;

const frames: Record<MoveCategoryId, SpritesheetFrame> = {
  physical: { x: 0, y: 0, w, h },
  special: { x: 0, y: h, w, h },
  status: { x: 0, y: h * 2, w, h },
};

export class CategoryIcon extends Entity implements ISprite {
  sprite: Sprite<MoveCategoryId>;

  constructor(category: MoveCategoryId) {
    super();
    this.sprite = new Sprite(this, {
      assetUrl,
      spritesheet: { frames, w, h: spritesheetHeight, defaultFrame: category },
    });
  }
}
