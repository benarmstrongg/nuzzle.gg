import { SpritesheetFrame } from '../../../../../engine';
import { BackgroundTileFrame, BackgroundTileId } from './types';

const assetUrls: Record<BackgroundTileId, string> = {
  light_grass: 'spritesheets/tiles/background/light_grass.png',
};

const spriteSheetWidth = 96;
const spriteSheetHeight = 128;
const w = spriteSheetWidth / 3;
const h = spriteSheetHeight / 4;

const frames: Record<BackgroundTileFrame, SpritesheetFrame> = {
  circle: { x: 0, y: 0, w, h },
  intersection: { x: w * 2, y: 0, w, h },
  top_left: { x: 0, y: h, w, h },
  top_center: { x: w, y: h, w, h },
  top_right: { x: w * 2, y: h, w, h },
  center_left: { x: 0, y: h * 2, w, h },
  center_center: { x: w, y: h * 2, w, h },
  center_right: { x: w * 2, y: h * 2, w, h },
  bottom_left: { x: 0, y: h * 3, w, h },
  bottom_center: { x: w, y: h * 3, w, h },
  bottom_right: { x: w * 2, y: h * 3, w, h },
};

export {
  assetUrls,
  frames,
  spriteSheetWidth as w,
  spriteSheetHeight as h,
  w as tileWidth,
  h as tileHeight,
};
