import { Entity, ISprite, Sprite } from '../../engine';
import { SpritesheetFrame } from '../../engine/traits/entity/sprite/types';
import { StatusType } from '../types';

const assetUrl = 'spritesheets/status.png';
const spritesheetHeight = 96;
const w = 44;
const h = 16;

const frames: Record<Exclude<StatusType, 'fnt'>, SpritesheetFrame> = {
  slp: { x: 0, y: 0, w, h },
  psn: { x: 0, y: h, w, h },
  brn: { x: 0, y: h * 2, w, h },
  par: { x: 0, y: h * 3, w, h },
  frz: { x: 0, y: h * 4, w, h },
  tox: { x: 0, y: h * 5, w, h },
};

export class StatusIcon extends Entity implements ISprite {
  sprite = new Sprite(this, {
    assetUrl,
    spritesheet: { frames, w, h: spritesheetHeight },
  });

  constructor(status: StatusType) {
    super();
    if (status === 'fnt') {
      return;
    }
    this.sprite.set(status);
  }
}
