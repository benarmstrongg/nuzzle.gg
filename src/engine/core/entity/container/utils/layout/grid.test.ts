import { describe, expect, it } from 'vitest';
import { applyGridLayout } from './grid';
import { Entity } from '../../../../../core';

describe('applyGridLayout', () => {
  it('positions children into rows/columns with gutter and gap', () => {
    const entity = Entity.container.box(
      { width: 110, height: 90 },
      new Entity(),
      new Entity(),
      new Entity(),
      new Entity()
    );

    applyGridLayout(
      { rows: 2, columns: 2, gutter: 10, gap: 5 },
      entity.container,
      entity
    );

    expect(entity.container.children[0].transform.x).toEqual(10);
    expect(entity.container.children[0].transform.y).toEqual(10);

    expect(entity.container.children[1].transform.x).toEqual(57.5);
    expect(entity.container.children[1].transform.y).toEqual(10);

    expect(entity.container.children[2].transform.x).toEqual(10);
    expect(entity.container.children[2].transform.y).toEqual(47.5);

    expect(entity.container.children[3].transform.x).toEqual(57.5);
    expect(entity.container.children[3].transform.y).toEqual(47.5);
  });
});
