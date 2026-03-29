import { describe, expect, it } from 'vitest';

import { GameObject } from './object';

describe('GameObject', () => {
  it('constructs successfully', () => {
    const object = new GameObject();
    expect(object).toBeInstanceOf(GameObject);
  });
});
