import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  PixiText: class {
    width = 40;
    height = 12;
    constructor(public options: any) {}
  },
}));

vi.mock('pixi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pixi.js')>();
  return {
    ...actual,
    Text: mocks.PixiText,
  };
});

import { Text } from './text';
import { game } from '../../../core';

describe('Text', () => {
  it('creates pixi text and sets entity ready/size', () => {
    game.settings.set({ defaultFont: 'Pokemon' });
    const entity = {
      ready: true,
      transform: { width: 0, height: 0 },
    } as any;

    const text = new Text(entity, 'Hello', { size: 'sm', color: '#fff', wrap: true });
    expect(text.state.value).toBe('Hello');
    expect(entity.ready).toBe(true);
    expect(entity.transform.width).toBe(40);
    expect(entity.transform.height).toBe(12);
  });
});
