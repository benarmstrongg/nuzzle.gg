import {
  Assets,
  Sprite as PixiSprite,
  Spritesheet as PixiSpritesheet,
  Texture,
} from 'pixi.js';
import { Entity } from '../../../core';
import { IState, State } from '../../meta/state';
import { SpriteScaleMode, SpritesheetOptions } from './types';
import { TransformState } from '../../meta';

export type SpriteOptions<TFrame extends string> = {
  assetUrl: string;
  fallbackAssetUrls?: string[];
  onLoad?: (fallback: string) => void;
  spritesheet?: SpritesheetOptions<TFrame>;
  anchor?: Partial<SpriteState<TFrame>['anchor']>;
  scaleMode?: SpriteScaleMode;
  transform?: Partial<TransformState>;
};

type SpriteState<TFrame extends string> = {
  frame: TFrame | (string & {});
  anchor: { x: number; y: number };
};

export class Sprite<TFrame extends string = string> implements IState {
  private inner = new PixiSprite({ interactive: true });
  private textures?: Record<TFrame | (string & {}), Texture>;
  state = new State<SpriteState<TFrame>>({
    frame: 'default',
    anchor: { x: 0, y: 0 },
  });

  private get scaleMode(): SpriteScaleMode {
    return this.options.scaleMode ?? 'nearest';
  }

  constructor(private entity: Entity, private options: SpriteOptions<TFrame>) {
    if (!options.assetUrl) {
      throw new Error('Sprite asset URL is required');
    }

    entity['inner'] = this.inner;
    this.initSprite(options);
    this.initTransform();
  }

  private initSprite(options: SpriteOptions<TFrame>) {
    if (options.spritesheet) {
      return this.loadSpritesheet(options.assetUrl, options.spritesheet);
    }

    this.set(options.assetUrl);
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

    this.state.on('anchor', ({ x, y }) => {
      this.inner.anchor.x = x;
      this.inner.anchor.y = y;
    });

    this.entity.onReady(() => {
      if (this.options.transform)
        this.entity.transform.set(this.options.transform);
    });
  }

  private async loadSpritesheet(
    assetUrl: string,
    options: SpritesheetOptions<TFrame>
  ) {
    const texture = await this.load(assetUrl);

    const frames = Object.entries(options.frames).reduce(
      (acc, [key, frame]) => Object.assign(acc, { [key]: { frame } }),
      {}
    );
    const spritesheet = new PixiSpritesheet(texture, {
      frames,
      meta: {
        image: texture.source.resource,
        size: { w: 0, h: 0 },
        scale: 1,
      },
    });
    this.textures = await spritesheet.parse();
    this.entity.ready = true;

    if (options.initialFrame) {
      this.set(options.initialFrame);
    }
  }

  private async loadSprite() {
    const texture = await this.load(
      this.options.assetUrl,
      this.options.fallbackAssetUrls
    );

    this.updateTexture(texture);
  }

  private async load(
    assetUrl: string,
    fallbackAssetUrls?: string[]
  ): Promise<Texture> {
    try {
      const texture: Texture = await Assets.load(assetUrl);

      if (!texture?.source) {
        throw new Error(`Failed to load texture at ${assetUrl}`);
      }

      texture.source.scaleMode = this.scaleMode;
      this.options.onLoad?.(assetUrl);
      return texture;
    } catch (err) {
      if (!fallbackAssetUrls?.length) {
        throw err;
      }

      console.log('onFallback', { assetUrl, fallbackAssetUrls });
      const fallback = fallbackAssetUrls[0];
      return this.load(fallback, fallbackAssetUrls.slice(1));
    }
  }

  set(frame: TFrame | (string & {})) {
    this.entity.ready = false;
    this.state.frame = frame;
    if (this.textures && this.textures[frame]) {
      this.textures[frame].source.scaleMode = this.scaleMode;
      this.updateTexture(this.textures[frame]);
    } else {
      this.loadSprite();
    }
  }

  private updateTexture(texture: Texture) {
    this.inner.texture = texture;
    this.inner.texture.update();

    const { width, height } = this.inner;
    this.entity.transform.set({ width, height });
    this.entity.ready = true;
  }
}

export interface ISprite {
  sprite: Sprite<any>;
}
