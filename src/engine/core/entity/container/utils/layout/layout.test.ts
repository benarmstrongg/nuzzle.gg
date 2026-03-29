import { describe, expect, it, } from 'vitest';
import { ContainerLayout } from './layout';
import { Entity } from '../../../entity';

describe('ContainerLayout', () => {
  it('calculates max size with no directional accumulation', () => {
    const child1 = Entity.container.box({
      width: 10,
      height: 20,
      x: 1,
      y: 2,
    });
    const child2 = Entity.container.box({
      width: 15,
      height: 5,
      x: 3,
      y: 4,
    });
    const entity = Entity.container.box({}, child1, child2);
    const layout = new ContainerLayout(entity.container, entity);
    expect(layout.calculateSize()).toEqual({ width: 18, height: 22 });
  });

  it('throws when apply is called with mismatched layout type', () => {
    const entity = Entity.container.box({});
    const layout = new ContainerLayout(entity.container, entity);
    layout.grid({ rows: 1, columns: 1 });
    layout.flex({});
    expect(() => (layout as any).applyGrid()).toThrow(
      /Error applying grid layout/
    );
  });
});