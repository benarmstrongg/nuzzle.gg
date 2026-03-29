import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  set: vi.fn(),
  add: vi.fn(),
  flex: vi.fn(),
  grid: vi.fn(),
}));

vi.mock('../../../core/entity', () => ({
  Entity: class {
    transform = { set: mocks.set };
  },
}));

vi.mock('./container', () => ({
  Container: class {
    layout = { flex: mocks.flex, grid: mocks.grid };
    add = mocks.add;
    constructor(_entity: any, ...children: any[]) {
      if (children.length) this.add(...children);
    }
  },
}));

import { containerFactory } from './factory';

describe('containerFactory', () => {
  it('creates a base container entity', () => {
    const child = { id: 'child' };
    containerFactory(child as any);
    expect(mocks.add).toHaveBeenCalledWith(child);
  });

  it('creates flex and grid containers with layout options', () => {
    containerFactory.flex({
      width: 100,
      height: 50,
      justify: 'center',
    });
    expect(mocks.set).toHaveBeenCalledWith({
      width: 100,
      height: 50,
      x: undefined,
      y: undefined,
    });
    expect(mocks.flex).toHaveBeenCalledWith({ justify: 'center' });

    containerFactory.grid({
      width: 200,
      height: 120,
      rows: 2,
      columns: 3,
    });
    expect(mocks.grid).toHaveBeenCalledWith({ rows: 2, columns: 3 });
  });

  it('creates centered container via flex center alignment', () => {
    containerFactory.center({ width: 20, height: 10 });
    expect(mocks.flex).toHaveBeenCalledWith({ justify: 'center', align: 'center' });
  });
});
