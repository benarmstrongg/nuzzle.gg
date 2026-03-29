import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  play: vi.fn(),
  TextureMock: class {
    source = { scaleMode: 'nearest' };
    update = vi.fn();
  },
}));

vi.mock('pixi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pixi.js')>();
  return {
    ...actual,
    AnimatedSprite: class {
      width = 32;
      height = 16;
      scale = { x: 1, y: 1 };
      anchor = { x: 0, y: 0 };
      animationSpeed = 0;
      textures: any[] = [];
      texture = new mocks.TextureMock();
      play = mocks.play;
      constructor(_textures: any[], _auto: boolean) {}
    },
    Texture: mocks.TextureMock,
  };
});

vi.mock('./utils/loader', () => ({
  SpriteLoader: class {
    textures = { idle: new mocks.TextureMock() };
    constructor(private sprite: any) {}
    async loadSprite() {
      return new mocks.TextureMock();
    }
    async loadSpritesheet() {
      this.sprite.ready = true;
      return new mocks.TextureMock();
    }
  },
}));

vi.mock('./utils/animations', () => ({
  SpriteAnimations: class {},
}));

import { Sprite } from './sprite';

describe('Sprite', () => {
  it('throws when assetUrl is missing', () => {
    expect(() => new Sprite({} as any, {} as any)).toThrow(/asset URL is required/);
  });

  it('loads sprite texture and marks entity ready', async () => {
    const entity = {
      ready: false,
      inner: null,
      transform: {
        width: 0,
        height: 0,
        set: vi.fn(),
        on: vi.fn(),
        scale: { on: vi.fn() },
      },
      onReady: (fn: () => void) => fn(),
    } as any;

    new Sprite(entity, { assetUrl: '/ok.png' });
    await Promise.resolve();

    expect(entity.ready).toBe(true);
    expect(entity.transform.set).toHaveBeenCalled();
    expect(mocks.play).toHaveBeenCalled();
  });
});
