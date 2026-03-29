import { describe, expect, it, vi } from 'vitest';
import { SpriteAnimations } from './animations';

describe('SpriteAnimations', () => {
  it('plays an animation and sets textures', () => {
    const inner = { textures: [], animationSpeed: 0, play: vi.fn(), stop: vi.fn() } as any;
    const sprite = { set: vi.fn() } as any;
    const loader = { textures: { a: { id: 'a' }, b: { id: 'b' } } } as any;
    const animations = new SpriteAnimations(
      sprite,
      inner,
      loader,
      {
        defaultFrame: 'a',
        w: 1,
        h: 1,
        frames: { a: { x: 0, y: 0, w: 1, h: 1 }, b: { x: 1, y: 0, w: 1, h: 1 } },
        animations: { walk: { frames: [{ frame: 'a' }, { frame: 'b' }] } },
      } as any
    );

    animations.play('walk' as any);
    expect(inner.play).toHaveBeenCalledTimes(1);
    expect(inner.textures).toEqual([{ id: 'a' }, { id: 'b' }]);
  });

  it('stops and returns to default frame when no returnToFrame is provided', () => {
    const inner = { textures: [], animationSpeed: 0, play: vi.fn(), stop: vi.fn() } as any;
    const sprite = { set: vi.fn() } as any;
    const loader = { textures: { a: { id: 'a' } } } as any;
    const animations = new SpriteAnimations(
      sprite,
      inner,
      loader,
      {
        defaultFrame: 'a',
        w: 1,
        h: 1,
        frames: { a: { x: 0, y: 0, w: 1, h: 1 } },
        animations: { idle: { frames: [{ frame: 'a' }] } },
      } as any
    );

    animations.play('idle' as any);
    animations.stop();
    expect(inner.stop).toHaveBeenCalledTimes(1);
    expect(sprite.set).toHaveBeenCalledWith('a');
  });
});
