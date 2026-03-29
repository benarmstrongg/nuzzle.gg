import { describe, expect, it, vi } from 'vitest';
import { ContainerLayout } from './layout';

describe('ContainerLayout', () => {
  it('calculates max size with no directional accumulation', () => {
    const container = {
      children: [
        { transform: { width: 10, height: 20, x: 1, y: 2 } },
        { transform: { width: 15, height: 5, x: 3, y: 4 } },
      ],
    } as any;
    const entity = { onReady: vi.fn() } as any;

    const layout = new ContainerLayout(container, entity);
    expect(layout.calculateSize()).toEqual({ width: 18, height: 22 });
  });

  it('throws when apply is called with mismatched layout type', () => {
    const layout = new ContainerLayout(
      { children: [] } as any,
      { onReady: vi.fn() } as any
    );
    layout.grid({ rows: 1, columns: 1 });
    layout.flex({});
    expect(() => (layout as any).applyGrid()).toThrow(/Error applying grid layout/);
  });
});
