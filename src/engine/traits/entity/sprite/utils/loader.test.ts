import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  load: vi.fn(),
}));

vi.mock('pixi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pixi.js')>();
  return {
    ...actual,
    Assets: { ...actual.Assets, load: mocks.load },
    Spritesheet: class {
      constructor(_texture: any, _data: any) {}
      parse = vi.fn(async () => ({ idle: { source: {} } }));
    },
  };
});

import { SpriteLoader } from './loader';

describe('SpriteLoader', () => {
  it('loads a single sprite texture', async () => {
    mocks.load.mockResolvedValueOnce({ source: {} });
    const sprite = { ready: true, scaleMode: 'nearest' } as any;
    const loader = new SpriteLoader(sprite, { assetUrl: '/sprite.png' } as any);

    const texture = await loader.loadSprite();
    expect(texture.source.scaleMode).toBe('nearest');
  });

  it('falls back to backup asset URLs on load failure', async () => {
    mocks.load
      .mockRejectedValueOnce(new Error('missing'))
      .mockResolvedValueOnce({ source: {} });
    const onLoad = vi.fn();
    const loader = new SpriteLoader(
      { ready: true, scaleMode: 'nearest' } as any,
      { assetUrl: '/missing.png', fallbackAssetUrls: ['/ok.png'], onLoad } as any
    );

    await loader.loadSprite();
    expect(onLoad).toHaveBeenCalledWith('/ok.png');
  });
});
