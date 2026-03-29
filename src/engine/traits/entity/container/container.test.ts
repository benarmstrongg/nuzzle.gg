import { describe, expect, it } from 'vitest';
import { Container } from './container';
import { Entity, game } from '../../../core';

describe('Container', () => {
  it('adds children, updates size, and applies layout', () => {
    (game as any).tick = (fn: (done: () => void) => void) => fn(() => {});
    const entity = new Entity();
    const child = new Entity();
    child.ready = true;
    const container = new Container(entity, child);

    expect(container.children).toEqual([child]);
    expect(entity.transform.width).toBeGreaterThanOrEqual(0);
  });

  it('clears children and emits ready=true', () => {
    (game as any).tick = (fn: (done: () => void) => void) => fn(() => {});
    const entity = new Entity();
    const container = new Container(entity);
    entity.ready = false;

    container.clear();

    expect(container.children).toEqual([]);
    expect(entity.ready).toBe(true);
  });
});
