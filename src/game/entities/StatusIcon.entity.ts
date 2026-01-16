import { Entity, ISprite, Sprite } from '../../engine';
import { SpritesheetFrame } from '../../engine/traits/entity/sprite/types';
import { StatusId } from '../types';

const assetUrl = 'spritesheets/status.png';
const spritesheetHeight = 96;
const w = 44;
const h = 16;

const frames: Record<StatusId, SpritesheetFrame> = {
  slp: { x: 0, y: 0, w, h },
  psn: { x: 0, y: h, w, h },
  brn: { x: 0, y: h * 2, w, h },
  par: { x: 0, y: h * 3, w, h },
  frz: { x: 0, y: h * 4, w, h },
  tox: { x: 0, y: h * 5, w, h },
};

export class StatusIcon extends Entity implements ISprite {
  sprite: Sprite<StatusId>;

  constructor(status: StatusId) {
    super();

    this.sprite = new Sprite(this, {
      assetUrl,
      spritesheet: { frames, w, h: spritesheetHeight, defaultFrame: status },
    });
  }
}
