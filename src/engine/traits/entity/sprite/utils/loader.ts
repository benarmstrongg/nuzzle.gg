import { Assets, Spritesheet as PixiSpritesheet, Texture } from 'pixi.js';
import type { Sprite, SpriteOptions } from '../sprite';
import { SpriteScaleMode, SpritesheetOptions } from '../types';

export class SpriteLoader<TFrame extends string, TAnimation extends string> {
  textures?: Record<TFrame | (string & {}), Texture>;

  private get scaleMode(): SpriteScaleMode {
    return this.options.scaleMode ?? 'nearest';
  }

  constructor(
    private sprite: Sprite<TFrame, TAnimation>,
    private options: SpriteOptions<TFrame, TAnimation>
  ) {}

  async loadSpritesheet(
    assetUrl: string,
    options: SpritesheetOptions<TFrame, TAnimation>
  ) {
    this.sprite.ready = false;
    const texture = await this.loadAsset(assetUrl);

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
    this.sprite.ready = true;

    if (options.defaultFrame) {
      this.sprite.set(options.defaultFrame);
    }
  }

  async loadSprite() {
    this.sprite.ready = false;
    const texture = await this.loadAsset(
      this.options.assetUrl,
      this.options.fallbackAssetUrls
    );

    this.updateTexture(texture);
  }

  private async loadAsset(
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

      const fallback = fallbackAssetUrls[0];
      console.log(`Sprite ${assetUrl} falling back to ${fallback}`);
      return this.loadAsset(fallback, fallbackAssetUrls.slice(1));
    }
  }

  updateTexture(texture: Texture) {
    texture.source.scaleMode = this.scaleMode;
    this.sprite['inner'].texture = texture;
    this.sprite['inner'].texture.update();

    const { width, height } = this.sprite['inner'];
    this.sprite['entity'].transform.set({ width, height });
    this.sprite.ready = true;
  }
}
