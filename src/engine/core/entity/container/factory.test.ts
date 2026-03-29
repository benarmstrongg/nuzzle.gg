import { describe, expect, it } from 'vitest';
import { containerFactory } from './factory';
import { Entity } from "../entity";

describe('containerFactory', () => {
  it('creates a base container entity', () => {
    const child = new Entity();
    const container = containerFactory(child);
    expect(container.container).toBeDefined();
    expect(container.container.children).toEqual([child]);
    expect(container.container.children[0]).toEqual(child);
  });

  it('creates flex and grid containers with layout options', () => {
    const flexContainer = containerFactory.flex({
      width: 100,
      height: 50,
      justify: 'center',
    });
    expect(flexContainer.transform.width).toEqual(100);
    expect(flexContainer.transform.height).toEqual(50);
    expect(flexContainer.container.layout['options']).toEqual(expect.objectContaining({
      type: 'flex',
      justify: 'center',
    }));

    const gridContainer = containerFactory.grid({
      width: 200,
      height: 120,
      rows: 2,
      columns: 3,
    });
    expect(gridContainer.transform.width).toEqual(200);
    expect(gridContainer.transform.height).toEqual(120);
    expect(gridContainer.container.layout['options']).toEqual(expect.objectContaining({
      type: 'grid',
      rows: 2,
      columns: 3,
    }));
  });

  it('creates centered container via flex center alignment', () => {
    const centerContainer = containerFactory.center({ width: 20, height: 10 });
    expect(centerContainer.transform.width).toEqual(20);
    expect(centerContainer.transform.height).toEqual(10);
    expect(centerContainer.container.layout['options']).toEqual(expect.objectContaining({
      type: 'flex',
      justify: 'center',
      align: 'center',
    }));
  });
});
