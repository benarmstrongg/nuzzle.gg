import { describe, expect, it } from 'vitest';

import { Box } from './box';

describe('Box', () => {
  it('creates a pixi graphic rectangle', () => {
    const box = new Box(20, 30);
    expect((box as any).inner).toBeTruthy();
  });
});
