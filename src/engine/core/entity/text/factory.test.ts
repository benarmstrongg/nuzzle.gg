import { describe, expect, it } from 'vitest';
import { textFactory } from './factory';

describe('textFactory', () => {
  it('creates text entities for base factory and size helpers', async () => {
    const base = textFactory('A');
    const heading = textFactory.heading('Title');

    expect(base.text.state.value).toBe('A');
    expect(heading.text.state.value).toBe('Title');
    expect(heading.transform.height).toBeGreaterThanOrEqual(20);
  });
});
