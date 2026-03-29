import { describe, expect, it } from 'vitest';
import { Collider, ICollider } from './collider';
import { Entity } from "../core";

const createColliderEntity = (x: number, y: number, width: number, height: number) => {
  return new class extends Entity implements ICollider {
    collider = new Collider(this);

    constructor() {
      super();
      this.transform.set({ x, y, width, height });
    }
  }
}

describe('Collisions', () => {
  it('should init', () => {
    expect(createColliderEntity(0, 0, 100, 100)).toBeDefined();
  });
});
