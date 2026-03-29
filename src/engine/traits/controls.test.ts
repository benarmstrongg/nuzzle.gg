import { beforeEach, describe, expect, it, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { Controls } from './controls';

describe('Controls', () => {
  beforeEach(() => {
    Controls.clear();
  });

  it('handles press callbacks based on configured keys', async () => {
    const controls = Controls.wasd();
    const callback = vi.fn();

    controls.press('up', callback);
    await userEvent.keyboard('{w}');
    await userEvent.keyboard('{x}');

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('handles hold down/up callbacks and pause/resume', async () => {
    const controls = Controls.wasd();
    const keydown = vi.fn();
    const keyup = vi.fn();

    controls.hold('left', keydown, keyup);
    await userEvent.keyboard('{a}');
    controls.pause();
    await userEvent.keyboard('{a}');
    controls.resume();
    await userEvent.keyboard('{a}');

    expect(keydown).toHaveBeenCalledTimes(2);
    expect(keyup).toHaveBeenCalledTimes(2);
  });

  it('deregisters handlers for a specific action via off', async () => {
    const controls = Controls.wasd();
    const callback = vi.fn();

    controls.press('a', callback);
    controls.off('a');
    await userEvent.keyboard('{k}');

    expect(callback).not.toHaveBeenCalled();
  });

  it('creates controls from the selected control scheme', async () => {
    const controls = Controls.selected();
    const callback = vi.fn();

    controls.press('right', callback);
    await userEvent.keyboard('{d}');

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
