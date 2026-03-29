import { describe, expect, it, vi } from 'vitest';
import { Sprite } from './sprite';
import { Entity } from "../entity";

vi.mock('./utils/loader', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils/loader')>();
  return {
    ...actual,
    SpriteLoader: class {
      loadSprite = vi.fn().mockResolvedValue({ source: { resource: 'test' } });
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
});
