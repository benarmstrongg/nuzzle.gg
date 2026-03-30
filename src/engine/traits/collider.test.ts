import { describe, expect, it } from 'vitest';
import { Collider, ICollider } from './collider';
import { Entity } from '../core';

describe('Collider', () => {
  it('identifies entities that have a collider instance', () => {
    const entity = new (class extends Entity implements ICollider {
      collider = new Collider(this);
    })();
    expect(Collider.isCollider(entity)).toBe(true);
    expect(Collider.isCollider({} as any)).toBe(false);
    expect(Collider.isCollider({ collider: {} } as any)).toBe(false);
  });

  it('sets collidingWith when entities enter', () => {
    const entity = new (class extends Entity implements ICollider {
      collider = new Collider(this);
    })();
    const other = new (class extends Entity implements ICollider {
      collider = new Collider(this);
    })();
    entity.collider.enter(other);
    expect(entity.collider.isCollidingWith(other)).toBe(true);
  });

  it('removes collidingWith when entities exit', () => {
    const entity = new (class extends Entity implements ICollider {
      collider = new Collider(this);
    })();
    const other = new (class extends Entity implements ICollider {
      collider = new Collider(this);
    })();
    entity.collider.enter(other);
    entity.collider.exit(other);
    expect(entity.collider.isCollidingWith(other)).toBe(false);
  });
});
