import { Spritesheet } from 'pixi.js';
import {
  ContainerObject,
  SpriteObject,
  SpriteObjectOptions,
} from '../../../../engine';

type BattleButtonOptions = Omit<SpriteObjectOptions, 'texture'> & {
  gridPosition: [number, number];
  textureId: string;
  spritesheet: Spritesheet;
};

export class BattleButton extends SpriteObject {
  gridPosition: [number, number];
  spritesheet: Spritesheet;
  textureId: string;

  constructor(opts: BattleButtonOptions) {
    const isHovered = opts.gridPosition[0] === 0 && opts.gridPosition[1] === 0;
    const asset = isHovered ? `${opts.textureId}_hovered` : opts.textureId;
    super({
      ...opts,
      texture: opts.spritesheet.textures[asset],
    });
    this.spritesheet = opts.spritesheet;
    this.gridPosition = opts.gridPosition;
    this.textureId = opts.textureId;
  }

  hover(container: ContainerObject) {
    this.setTexture(
      this.spritesheet.textures[`${this.textureId}_hovered`],
      container
    );
  }

  unhover(container: ContainerObject) {
    this.setTexture(this.spritesheet.textures[this.textureId], container);
  }
}
