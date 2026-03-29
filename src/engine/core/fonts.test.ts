import { describe, expect, it, vi } from 'vitest';
import { Fonts } from './fonts';
import { Assets } from 'pixi.js';

describe('Fonts', () => {
  it('stores added fonts and loads them as a bundle', async () => {
    const addBundle = vi.spyOn(Assets, 'addBundle').mockImplementation(() => {});
    const loadBundle = vi
      .spyOn(Assets, 'loadBundle')
      .mockImplementation(async () => ({} as any));

    const fonts = new Fonts();
    const bundle = [{ alias: 'main', src: '/font.ttf' }];

    fonts.add(bundle);
    await fonts.load();

    expect(addBundle).toHaveBeenCalledWith('fonts', bundle);
    expect(loadBundle).toHaveBeenCalledWith('fonts');
  });

  it('exposes default font size map', () => {
    const fonts = new Fonts();
    expect(fonts.sizeMap.heading).toBe(24);
    expect(fonts.sizeMap.sm).toBe(14);
  });
});
