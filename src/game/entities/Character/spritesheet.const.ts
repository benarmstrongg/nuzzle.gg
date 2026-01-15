import { SpriteAnimationOptions, SpritesheetFrame } from '../../../engine';
import { CharacterAnimation, CharacterFrame, CharacterId } from './types';

const assetUrls: Record<CharacterId, string> = {
  red: 'spritesheets/characters/red.png',
};

const spriteSheetWidth = 128;
const spriteSheetHeight = 192;
const w = spriteSheetWidth / 4;
const h = spriteSheetHeight / 4;
const frames: Record<CharacterFrame, SpritesheetFrame> = {
  // idle
  idle_down: { x: 0, y: 0, w, h },
  idle_left: { x: 0, y: h, w, h },
  idle_right: { x: 0, y: h * 2, w, h },
  idle_up: { x: 0, y: h * 3, w, h },

  // walk down
  walk_down_1: { x: w, y: 0, w, h },
  walk_down_2: { x: w * 2, y: 0, w, h },
  walk_down_3: { x: w * 3, y: 0, w, h },

  // walk left
  walk_left_1: { x: w, y: h, w, h },
  walk_left_2: { x: w * 2, y: h, w, h },
  walk_left_3: { x: w * 3, y: h, w, h },

  // walk right
  walk_right_1: { x: w, y: h * 2, w, h },
  walk_right_2: { x: w * 2, y: h * 2, w, h },
  walk_right_3: { x: w * 3, y: h * 2, w, h },

  // walk up
  walk_up_1: { x: w, y: h * 3, w, h },
  walk_up_2: { x: w * 2, y: h * 3, w, h },
  walk_up_3: { x: w * 3, y: h * 3, w, h },
};

const animations: Record<
  CharacterAnimation,
  SpriteAnimationOptions<CharacterFrame>
> = {
  idle_down: { frames: [{ frame: 'idle_down' }] },
  idle_left: { frames: [{ frame: 'idle_left' }] },
  idle_right: { frames: [{ frame: 'idle_right' }] },
  idle_up: { frames: [{ frame: 'idle_up' }] },
  walk_down: {
    frames: [
      { frame: 'walk_down_1', duration: 100 },
      { frame: 'walk_down_2', duration: 100 },
      { frame: 'walk_down_3', duration: 100 },
      { frame: 'walk_down_2', duration: 100 },
    ],
    returnToFrame: 'idle_down',
    repeat: true,
  },
  walk_left: {
    frames: [
      { frame: 'walk_left_1', duration: 100 },
      { frame: 'walk_left_2', duration: 100 },
      { frame: 'walk_left_3', duration: 100 },
      { frame: 'walk_left_2', duration: 100 },
    ],
    returnToFrame: 'idle_left',
    repeat: true,
  },
  walk_right: {
    frames: [
      { frame: 'walk_right_1', duration: 100 },
      { frame: 'walk_right_2', duration: 100 },
      { frame: 'walk_right_3', duration: 100 },
      { frame: 'walk_right_2', duration: 100 },
    ],
    returnToFrame: 'idle_right',
    repeat: true,
  },
  walk_up: {
    frames: [
      { frame: 'walk_up_1', duration: 100 },
      { frame: 'walk_up_2', duration: 100 },
      { frame: 'walk_up_3', duration: 100 },
      { frame: 'walk_up_2', duration: 100 },
    ],
    returnToFrame: 'idle_up',
    repeat: true,
  },
};

const defaultFrame: CharacterFrame = 'idle_down';

export {
  assetUrls,
  frames,
  defaultFrame,
  spriteSheetWidth as w,
  spriteSheetHeight as h,
  animations,
};
