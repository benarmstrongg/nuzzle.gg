import { describe, expect, it, vi } from 'vitest';
import { Random } from './random';

describe('Random', () => {
  it('returns values between 0 and max when only max is provided', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9999);

    expect(Random.int(3)).toBe(0);
    expect(Random.int(3)).toBe(3);
  });

  it('returns values between min and max when both are provided', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.9999);

    expect(Random.int(2, 4)).toBe(2);
    expect(Random.int(2, 4)).toBe(4);
  });
});
