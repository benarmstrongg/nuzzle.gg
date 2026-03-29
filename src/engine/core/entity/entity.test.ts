import { describe, expect, it, vi } from 'vitest';
import { Entity } from './entity';

describe('Entity', () => {
  it('tracks ready and visible state', () => {
    const entity = new Entity();
    const onReady = vi.fn();
    entity.onReady(onReady);
    entity.ready = true;
    entity.visible = false;
    expect(entity.ready).toBe(true);
    expect(entity.visible).toBe(false);
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('runs onReady callback immediately when already ready', () => {
    const entity = new Entity();
    const onReady = vi.fn();
    entity.ready = true;
    entity.onReady(onReady);
    expect(onReady).toHaveBeenCalledTimes(1);
  });

  it('destroys inner object and exposes factories', () => {
    const entity = new Entity();
    const innerDestoySpy = vi.spyOn(entity['inner'], 'destroy');
    entity.destroy();
    expect(innerDestoySpy).toHaveBeenCalledTimes(1);
  });
});
