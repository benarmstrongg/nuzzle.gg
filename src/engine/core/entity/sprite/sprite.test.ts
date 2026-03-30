import { describe, expect, it, vi } from 'vitest';
import { Sprite } from './sprite';
import { Entity } from '../entity';

vi.mock('./utils/loader', async (importOriginal) => {
  const { Texture } = await import('pixi.js');
  const actual = await importOriginal<typeof import('./utils/loader')>();
  /** Non-zero frame size so `updateTexture` sets layout-sized transforms. */
  const mockTexture = Texture.WHITE;
  return {
    ...actual,
    SpriteLoader: class {
      loadSprite = vi.fn().mockResolvedValue(mockTexture);
      loadSpritesheet = vi.fn().mockResolvedValue(mockTexture);
    },
  };
});

describe('Sprite', () => {
  it('throws when assetUrl is missing', () => {
    expect(() => new Sprite(new Entity(), {} as any)).toThrow(/asset URL is required/);
  });

  it('loads sprite texture and marks entity ready', async () => {
    const entity = new class extends Entity.Sprite {
      sprite = new Sprite(this, { assetUrl: 'sprites/pokemon/25.png' });
    }();
    vi.spyOn(entity.transform, 'set');

    await new Promise((resolve) => entity.onReady(() => resolve(true)));
    expect(entity.ready).toBe(true);
    expect(entity.transform.set).toHaveBeenCalled();
  });

  it('does not report ready until transform width and height are set (static texture)', async () => {
    const entity = new class extends Entity.Sprite {
      sprite = new Sprite(this, { assetUrl: 'sprites/pokemon/25.png' });
    }();

    await new Promise<void>((resolve) => {
      entity.onReady(() => {
        expect(entity.ready).toBe(true);
        expect(entity.transform.width).toBeGreaterThan(0);
        expect(entity.transform.height).toBeGreaterThan(0);
        resolve();
      });
    });
  });

  it('does not report ready until transform width and height are set (spritesheet)', async () => {
    const entity = new class extends Entity.Sprite {
      sprite = new Sprite(this, {
        assetUrl: 'spritesheets/types.png',
        spritesheet: {
          frames: { fire: { x: 0, y: 0, w: 16, h: 16 } },
          defaultFrame: 'fire',
          w: 16,
          h: 16,
        },
      });
    }();

    await new Promise<void>((resolve) => {
      entity.onReady(() => {
        expect(entity.ready).toBe(true);
        expect(entity.transform.width).toBeGreaterThan(0);
        expect(entity.transform.height).toBeGreaterThan(0);
        resolve();
      });
    });
  });
});
