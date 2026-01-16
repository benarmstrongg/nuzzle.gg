import { Entity, ISprite, Sprite } from '../../../../../engine';
import {
  assetUrls,
  frames,
  w,
  h,
  tileHeight,
  tileWidth,
} from './spritesheet.const';
import { BackgroundTileFrame, BackgroundTileId } from './types';

export class BackgroundTile extends Entity implements ISprite {
  static width = tileWidth;
  static height = tileHeight;

  sprite: Sprite<BackgroundTileFrame>;

  constructor(tile: BackgroundTileId, frame: BackgroundTileFrame) {
    super();

    const assetUrl = assetUrls[tile];
    if (!assetUrl) {
      throw new Error(`Background tile ${tile} not found`);
    }
    this.sprite = new Sprite(this, {
      assetUrl,
      spritesheet: { frames, w, h, defaultFrame: frame },
    });
  }
}
