import { Spritesheet } from 'pixi.js';
import { loadSpritesheet } from '../../../util/assets.util';
import { BattleButton } from './button.obj';
import { SpriteObjectOptions } from '../../../../engine';

const ASSET = 'spritesheets/battle_command_button.png';
const SPRITESHEET_WIDTH = 260;
const SPRITESHEET_HEIGHT = 460;
const w = 130;
const h = 46;

const IDLE_FRAMES = {
  fight: { frame: { x: 0, y: 0, w, h } },
  pokemon: { frame: { x: 0, y: h, w, h } },
  bag: { frame: { x: 0, y: h * 2, w, h } },
  run: { frame: { x: 0, y: h * 3, w, h } },
} as const;

const HOVERED_FRAMES = {
  fight_hovered: { frame: { x: w, y: 0, w, h } },
  pokemon_hovered: { frame: { x: w, y: h, w, h } },
  bag_hovered: { frame: { x: w, y: h * 2, w, h } },
  run_hovered: { frame: { x: w, y: h * 3, w, h } },
} as const;

type BattleCommand = keyof typeof IDLE_FRAMES;

type CommandButtonOptions = Omit<SpriteObjectOptions, 'texture'> & {
  gridPosition: [number, number];
  command: BattleCommand;
};

export class CommandButton extends BattleButton {
  private static spritesheet: Spritesheet;
  static width = w;
  static height = h;

  static async load() {
    if (CommandButton.spritesheet) {
      return;
    }
    CommandButton.spritesheet = await loadSpritesheet(
      ASSET,
      Object.assign(IDLE_FRAMES, HOVERED_FRAMES),
      SPRITESHEET_WIDTH,
      SPRITESHEET_HEIGHT
    );
  }

  constructor(opts: CommandButtonOptions) {
    super({
      ...opts,
      textureId: opts.command,
      spritesheet: CommandButton.spritesheet,
    });
  }
}
