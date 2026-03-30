import { describe, expect, it, vi } from 'vitest';
import { Container } from './container';
import { Entity } from '../../../core';

function containerParent(): Entity.Container {
  return new (class extends Entity.Container {
    container = new Container(this);
  })();
}

describe('Container', () => {
  it('adds children, updates size, and applies layout', () => {
    const entity = new Entity();
    const child = new Entity();
    child.ready = true;
    const container = new Container(entity, child);

    expect(container.children).toEqual([child]);
    expect(entity.transform.width).toBeGreaterThanOrEqual(0);
  });

  it('clears children and emits ready=true', () => {
    const entity = new Entity();
    const container = new Container(entity);
    entity.ready = false;

    container.clear();

    expect(container.children).toEqual([]);
    expect(entity.ready).toBe(true);
  });

  it('marks container entity ready when every child is ready', () => {
    const a = new Entity();
    const b = new Entity();
    a.ready = false;
    b.ready = false;

    const containerEntity = new (class extends Entity.Container {
      container = new Container(this, a, b);
    })();

    expect(containerEntity.ready).toBe(false);

    a.ready = true;
    expect(containerEntity.ready).toBe(false);

    b.ready = true;
    expect(containerEntity.ready).toBe(true);
  });

  it('marks container entity ready on render when there are no children', () => {
    const parent = containerParent();
    const containerEntity = Entity.container();

    expect(containerEntity.ready).toBe(false);

    containerEntity.render(parent);

    expect(containerEntity.ready).toBe(true);
  });

  it('sets child container parent and calls render when added to a container', () => {
    const parent = containerParent();
    const containerEntity = Entity.container();
    vi.spyOn(containerEntity, 'render');

    parent.container.add(containerEntity);
    parent.render(parent);

    expect(containerEntity.parent).toBe(parent);
    expect(containerEntity.render).toHaveBeenCalled();
  });
});
