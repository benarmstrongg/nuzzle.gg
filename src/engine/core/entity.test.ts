import { describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({
  destroy: vi.fn(),
}));

vi.mock('./object', () => ({
  GameObject: class {
    visible = true;
    destroy = mocks.destroy;
  },
}));

vi.mock('./transform', () => ({
  Transform: class {
    constructor(_entity: unknown) {}
  },
}));

vi.mock('../traits', async () => {
  const { State } = await vi.importActual<
    typeof import('../traits/meta/state')
  >('../traits/meta/state');
  return {
    State,
    Sprite: class {},
    containerFactory: vi.fn(),
  };
});

vi.mock('../debug', () => ({
  cover: (value: unknown) => value,
  draggable: (value: unknown) => value,
  log: (value: unknown) => value,
}));

vi.mock('../traits/entity/text', () => ({
  textFactory: vi.fn(),
}));

import { Entity } from './entity';

describe('Entity', () => {
  it('tracks ready and visible state', () => {
    const entity = new Entity();
    entity.ready = true;
    entity.visible = false;

    expect(entity.ready).toBe(true);
    expect(entity.visible).toBe(false);
  });

  it('runs onReady callback immediately when already ready', () => {
    const entity = new Entity();
    const fn = vi.fn();
    entity.ready = true;

    entity.onReady(fn);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('destroys inner object and exposes factories', () => {
    const entity = new Entity();
    entity.destroy();

    expect(mocks.destroy).toHaveBeenCalledTimes(1);
    expect(typeof Entity.text).toBe('function');
    expect(typeof Entity.container).toBe('function');
  });

  it('exposes static sprite factory function', () => {
    expect(typeof Entity.sprite).toBe('function');
  });
});
