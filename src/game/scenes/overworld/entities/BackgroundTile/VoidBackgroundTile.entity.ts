import {
  Collider,
  Coordinate,
  Entity,
  ICollider,
  ISprite,
  Sprite,
  SpritesheetFrame,
} from '../../../../../engine';
import { tileHeight, tileWidth, h, w } from './spritesheet.const';

const assetUrl = 'spritesheets/tiles/void.png';

type VoidBackgroundTileFrame = 'void1' | 'void2' | 'void3' | 'void4';

const frames: Record<VoidBackgroundTileFrame, SpritesheetFrame> = {
  void1: { x: 0, y: 0, w: tileWidth, h: tileHeight },
  void2: { x: w, y: 0, w: tileWidth, h: tileHeight },
  void3: { x: w * 2, y: 0, w: tileWidth, h: tileHeight },
  void4: { x: w * 3, y: 0, w: tileWidth, h: tileHeight },
};

const width = tileWidth;
const height = tileHeight;

export class VoidBackgroundTile extends Entity implements ISprite, ICollider {
  static width = width;
  static height = height;

  sprite = new Sprite(this, {
    assetUrl,
    spritesheet: { frames, w, h, defaultFrame: 'void1' },
  });
  collider: Collider;

  constructor(position: Coordinate) {
    super();
    this.collider = new Collider(this);
    this.transform.set({ width, height, ...position });
  }
}
