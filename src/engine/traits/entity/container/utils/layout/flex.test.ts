import { describe, expect, it } from 'vitest';
import { applyFlexLayout } from './flex';

function child(width: number, height: number) {
  return { transform: { width, height, x: 0, y: 0 } };
}

describe('applyFlexLayout', () => {
  it('lays out row/start children with gap', () => {
    const children = [child(10, 5), child(20, 8)];

    applyFlexLayout(
      { direction: 'row', justify: 'start', align: 'start', gap: 3, gutter: 2 },
      { children } as any,
      { transform: { width: 100, height: 50 } } as any
    );

    expect(children[0].transform.x).toBe(2);
    expect(children[1].transform.x).toBe(15);
    expect(children[0].transform.y).toBe(2);
  });

  it.skip('centers column children using container width on x axis', () => {
    const children = [child(20, 10)];

    applyFlexLayout(
      { direction: 'column', justify: 'start', align: 'center' },
      { children } as any,
      { transform: { width: 80, height: 100 } } as any
    );

    expect(children[0].transform.x).toBe(30);
    expect(children[0].transform.y).toBe(0);
  });
});
