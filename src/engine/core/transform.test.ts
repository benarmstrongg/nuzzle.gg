import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Transform } from './transform';
import { game } from './game';

function createEntity() {
  return {
    inner: {
      x: 0,
      y: 0,
      width: 5,
      height: 7,
      position: { set: vi.fn() },
      getGlobalPosition: () => ({ x: 12, y: 34 }),
    },
  } as any;
}

describe('Transform', () => {
  beforeEach(() => {
    (game as any).tick = (fn: (done: () => void) => void) => {
      let done = false;
      const stop = () => {
        done = true;
      };
      for (let i = 0; i < 50 && !done; i++) fn(stop);
    };
  });

  it('initializes from entity inner size and position', () => {
    const entity = createEntity();
    const transform = new Transform(entity);

    expect(transform.width).toBe(5);
    expect(transform.height).toBe(7);
    expect(transform.x).toBe(0);
    expect(transform.y).toBe(0);
  });

  it('updates entity position when x/y are set', () => {
    const entity = createEntity();
    const transform = new Transform(entity);

    transform.x = 10;
    transform.y = 20;

    expect(entity.inner.position.set).toHaveBeenLastCalledWith(10, 20);
  });

  it('updates values via set and exposes global coords', () => {
    const entity = createEntity();
    const transform = new Transform(entity);

    transform.set({ x: 3, y: 4, width: 8, height: 9 });

    expect(transform.x).toBe(3);
    expect(transform.y).toBe(4);
    expect(transform.width).toBe(8);
    expect(transform.height).toBe(9);
    expect(transform.globalX).toBe(12);
    expect(transform.globalY).toBe(34);
  });

  it('moves to a target over ticks', () => {
    const entity = createEntity();
    const transform = new Transform(entity);

    transform.moveTo({ x: 4, y: 6 }, 2);

    expect(transform.x).toBe(4);
    expect(transform.y).toBe(6);
  });

  it('moves by a delta over ticks', () => {
    const entity = createEntity();
    const transform = new Transform(entity);

    transform.set({ x: 1, y: 2 });
    transform.moveBy({ x: 3, y: -1 }, 2);

    expect(transform.x).toBe(4);
    expect(transform.y).toBe(1);
  });

  it.skip('moves instantly when duration is zero', () => {
    const entity = createEntity();
    const transform = new Transform(entity);

    transform.moveTo({ x: 10, y: 10 }, 0);

    expect(transform.x).toBe(10);
    expect(transform.y).toBe(10);
  });
});
