import { Move } from '@pkmn/sim';
import { Spritesheet } from 'pixi.js';
import { BattleButton } from './button.obj';

type SpriteObjectOptions = any;
const loadSpritesheet = (...args: any[]): any => {};

const ASSET = 'spritesheets/battle_move_button.png';
const SPRITESHEET_WIDTH = 260;
const SPRITESHEET_HEIGHT = 460;
const w = 192;
const h = 46;

const IDLE_FRAMES = {
  normal: { frame: { x: 0, y: 0, w, h } },
  fighting: { frame: { x: 0, y: h, w, h } },
  flying: { frame: { x: 0, y: h * 2, w, h } },
  poison: { frame: { x: 0, y: h * 3, w, h } },
  ground: { frame: { x: 0, y: h * 4, w, h } },
  rock: { frame: { x: 0, y: h * 5, w, h } },
  bug: { frame: { x: 0, y: h * 6, w, h } },
  ghost: { frame: { x: 0, y: h * 7, w, h } },
  steel: { frame: { x: 0, y: h * 8, w, h } },
  '???': { frame: { x: 0, y: h * 9, w, h } },
  fire: { frame: { x: 0, y: h * 10, w, h } },
  water: { frame: { x: 0, y: h * 11, w, h } },
  grass: { frame: { x: 0, y: h * 12, w, h } },
  electric: { frame: { x: 0, y: h * 13, w, h } },
  psychic: { frame: { x: 0, y: h * 14, w, h } },
  ice: { frame: { x: 0, y: h * 15, w, h } },
  dragon: { frame: { x: 0, y: h * 16, w, h } },
  dark: { frame: { x: 0, y: h * 17, w, h } },
  fairy: { frame: { x: 0, y: h * 18, w, h } },
} as const;

const HOVERED_FRAMES = {
  normal_hovered: { frame: { x: w, y: 0, w, h } },
  fighting_hovered: { frame: { x: w, y: h, w, h } },
  flying_hovered: { frame: { x: w, y: h * 2, w, h } },
  poison_hovered: { frame: { x: w, y: h * 3, w, h } },
  ground_hovered: { frame: { x: w, y: h * 4, w, h } },
  rock_hovered: { frame: { x: w, y: h * 5, w, h } },
  bug_hovered: { frame: { x: w, y: h * 6, w, h } },
  ghost_hovered: { frame: { x: w, y: h * 7, w, h } },
  steel_hovered: { frame: { x: w, y: h * 8, w, h } },
  '???_hovered': { frame: { x: w, y: h * 9, w, h } },
  fire_hovered: { frame: { x: w, y: h * 10, w, h } },
  water_hovered: { frame: { x: w, y: h * 11, w, h } },
  grass_hovered: { frame: { x: w, y: h * 12, w, h } },
  electric_hovered: { frame: { x: w, y: h * 13, w, h } },
  psychic_hovered: { frame: { x: w, y: h * 14, w, h } },
  ice_hovered: { frame: { x: w, y: h * 15, w, h } },
  dragon_hovered: { frame: { x: w, y: h * 16, w, h } },
  dark_hovered: { frame: { x: w, y: h * 17, w, h } },
  fairy_hovered: { frame: { x: w, y: h * 18, w, h } },
} as const;

type MoveButtonOptions = Omit<SpriteObjectOptions, 'texture'> & {
  gridPosition: [number, number];
  moveData: Move;
};

export class MoveButton extends BattleButton {
  private static spritesheet: Spritesheet;
  static width = w;
  static height = h;
  moveData: Move;

  static async load() {
    if (MoveButton.spritesheet) {
      return;
    }
    MoveButton.spritesheet = await loadSpritesheet(
      ASSET,
      Object.assign(IDLE_FRAMES, HOVERED_FRAMES),
      SPRITESHEET_WIDTH,
      SPRITESHEET_HEIGHT
    );
  }

  constructor(opts: MoveButtonOptions) {
    super({
      ...opts,
      textureId: opts.moveData.type,
      spritesheet: MoveButton.spritesheet,
    });
    this.moveData = opts.moveData;
  }
}
