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

import { textFactory } from './factory';
import { game } from '../../../core';

describe('textFactory', () => {
  it('creates text entities for base factory and size helpers', () => {
    game.settings.set({ defaultFont: 'Pokemon' });
    const base = textFactory('A');
    const heading = textFactory.heading('Title');

    expect(base.text.state.value).toBe('A');
    expect(heading.text.state.value).toBe('Title');
    expect(heading.transform.height).toBeGreaterThanOrEqual(0);
  });
});
