import { describe, expect, it, vi } from 'vitest';
import { Collisions } from './collisions';
import { Collider } from './collider';

function createColliderEntity(x: number, y: number, width: number, height: number) {
  const listeners = new Map<string, ((value: number) => void)[]>();
  return {
    collider: new Collider({} as any),
    transform: {
      x,
      y,
      width,
      height,
      on: vi.fn((axis: 'x' | 'y', listener: (value: number) => void) => {
        listeners.set(axis, [...(listeners.get(axis) ?? []), listener]);
      }),
      off: vi.fn(),
    },
    __emit(axis: 'x' | 'y', value: number) {
      listeners.get(axis)?.forEach((fn) => fn(value));
    },
  } as any;
}

describe('Collisions', () => {
  it('registers collider listeners when child is added', () => {
    let onAdded: ((child: any) => void) | undefined;
    const containerEntity = {
      inner: { width: 10, height: 10 },
      container: {
        onChildAdded: (fn: (child: any) => void) => (onAdded = fn),
        onChildRemoved: vi.fn(),
      },
    } as any;

    new Collisions(containerEntity);
    const child = createColliderEntity(1, 2, 2, 2);
    onAdded!(child);

    expect(child.transform.on).toHaveBeenCalledTimes(2);
    expect(child.transform.on).toHaveBeenCalledWith('x', expect.any(Function));
    expect(child.transform.on).toHaveBeenCalledWith('y', expect.any(Function));
  });

  it('unregisters collider listeners when child is removed', () => {
    let onAdded: ((child: any) => void) | undefined;
    let onRemoved: ((child: any) => void) | undefined;
    const containerEntity = {
      inner: { width: 10, height: 10 },
      container: {
        onChildAdded: (fn: (child: any) => void) => (onAdded = fn),
        onChildRemoved: (fn: (child: any) => void) => (onRemoved = fn),
      },
    } as any;

    new Collisions(containerEntity);
    const child = createColliderEntity(1, 2, 2, 2);
    onAdded!(child);
    onRemoved!(child);

    expect(child.transform.off).toHaveBeenCalledTimes(2);
    expect(child.transform.off).toHaveBeenCalledWith('x', expect.any(Function));
    expect(child.transform.off).toHaveBeenCalledWith('y', expect.any(Function));
  });
});
