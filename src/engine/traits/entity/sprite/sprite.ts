import { Sprite as PixiSprite } from 'pixi.js';
import { Entity } from '../../../core';
import { State } from '../../meta/state';
import { SpriteScaleMode, SpritesheetOptions } from './types';
import { Coordinate, TransformState } from '../../../core/transform';
import { SpriteLoader } from './utils/loader';
import { SpriteAnimations } from './utils/animations';

export type SpriteOptions<TFrame extends string, TAnimation extends string> = {
  assetUrl: string;
  fallbackAssetUrls?: string[];
  onLoad?: (fallback: string) => void;
  spritesheet?: SpritesheetOptions<TFrame, TAnimation>;
  anchor?: Partial<Coordinate>;
  scaleMode?: SpriteScaleMode;
  transform?: Partial<TransformState>;
};

export class Sprite<
  TFrame extends string = string,
  TAnimation extends string = string
> {
  private inner = new PixiSprite({ interactive: true });

  private loader: SpriteLoader<TFrame, TAnimation>;
  animation: SpriteAnimations<TFrame, TAnimation>;

  frame: TFrame | null = null;
  anchor = new State<Coordinate>({ x: 0, y: 0 });

  get ready(): boolean {
    return this.entity.ready;
  }
  set ready(ready: boolean) {
    this.entity.ready = ready;
  }

  constructor(
    private entity: Entity,
    private options: SpriteOptions<TFrame, TAnimation>
  ) {
    if (!options.assetUrl) {
      throw new Error('Sprite asset URL is required');
    }

    entity['inner'] = this.inner;

    this.loader = new SpriteLoader(this, options);

    this.initSprite(options);
    this.initTransform();
  }

  set(frame: TFrame) {
    if (!this.loader.textures?.[frame]) {
      throw new Error(
        `Sprite frame ${frame} not found. If you're not using a spritesheet, create a new static sprite instead.`
      );
    }

    this.frame = frame;
    this.loader.updateTexture(this.loader.textures[frame]);
  }

  private initSprite(options: SpriteOptions<TFrame, TAnimation>) {
    if (options.spritesheet) {
      return this.loader.loadSpritesheet(options.assetUrl, options.spritesheet);
    }

    this.loader.loadSprite();
  }

  private initTransform() {
    this.entity.transform.on('width', (width) => {
      this.entity['inner'].width = width;
    });
    this.entity.transform.on('height', (height) => {
      this.entity['inner'].height = height;
    });
    this.entity.transform.scale.on('x', (scaleX) => {
      this.entity['inner'].scale.x = scaleX;
      this.entity.transform.width = this.entity['inner'].width;
    });
    this.entity.transform.scale.on('y', (scaleY) => {
      this.entity['inner'].scale.y = scaleY;
      this.entity.transform.height = this.entity['inner'].height;
    });

    this.anchor.onChange(({ x, y }) => {
      this.inner.anchor.x = x;
      this.inner.anchor.y = y;
    });

    this.entity.onReady(() => {
      if (this.options.transform)
        this.entity.transform.set(this.options.transform);
    });
  }
}

export interface ISprite {
  sprite: Sprite<any>;
}
