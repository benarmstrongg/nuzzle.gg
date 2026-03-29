import { describe, expect, it } from 'vitest';
import { Collider } from './collider';

describe('Collider', () => {
  it('identifies entities that have a collider instance', () => {
    const entity = { collider: new Collider({} as any) } as any;
    expect(Collider.isCollider(entity)).toBe(true);
  });

  it('rejects entities without a collider instance', () => {
    expect(Collider.isCollider({} as any)).toBe(false);
    expect(Collider.isCollider({ collider: {} } as any)).toBe(false);
  });
});
