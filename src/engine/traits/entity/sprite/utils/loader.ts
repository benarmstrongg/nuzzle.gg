import { Assets, Spritesheet as PixiSpritesheet, Texture } from 'pixi.js';
import type { Sprite, SpriteOptions } from '../sprite';
import { SpritesheetOptions } from '../types';

export class SpriteLoader<TFrame extends string, TAnimation extends string> {
  textures?: Record<TFrame, Texture>;

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

    return this.textures[options.defaultFrame];
  }

  async loadSprite() {
    this.sprite.ready = false;
    const texture = await this.loadAsset(
      this.options.assetUrl,
      this.options.fallbackAssetUrls
    );

    return texture;
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

      texture.source.scaleMode = this.sprite.scaleMode;
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
}
