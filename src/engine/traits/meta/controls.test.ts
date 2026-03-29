import { beforeEach, describe, expect, it, vi } from 'vitest';

const listeners = new Map<string, Set<(e: KeyboardEvent) => void>>();
const addEventListener = vi.fn((type: string, listener: (e: KeyboardEvent) => void) => {
  listeners.set(type, listeners.get(type) ?? new Set());
  listeners.get(type)!.add(listener);
});
const removeEventListener = vi.fn(
  (type: string, listener: (e: KeyboardEvent) => void) => {
    listeners.get(type)?.delete(listener);
  }
);

Object.assign(globalThis, {
  document: { addEventListener, removeEventListener },
});

vi.mock('../../core', () => ({
  game: {
    settings: { controlScheme: 'wasd' },
  },
}));

import { Controls } from './controls';

function emit(type: string, key: string) {
  const event = { key } as KeyboardEvent;
  listeners.get(type)?.forEach((listener) => listener(event));
}

describe('Controls', () => {
  beforeEach(() => {
    listeners.clear();
    addEventListener.mockClear();
    removeEventListener.mockClear();
    Controls.clear();
  });

  it('handles press callbacks based on configured keys', () => {
    const controls = Controls.wasd();
    const callback = vi.fn();

    controls.press('up', callback);
    emit('keypress', 'w');
    emit('keypress', 'x');

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('handles hold down/up callbacks and pause/resume', () => {
    const controls = Controls.wasd();
    const down = vi.fn();
    const up = vi.fn();

    controls.hold('left', down, up);
    emit('keydown', 'a');
    emit('keyup', 'a');
    controls.pause();
    emit('keydown', 'a');
    controls.resume();
    emit('keydown', 'a');

    expect(down).toHaveBeenCalledTimes(2);
    expect(up).toHaveBeenCalledTimes(1);
  });

  it('deregisters handlers for a specific action via off', () => {
    const controls = Controls.wasd();
    const callback = vi.fn();

    controls.press('a', callback);
    controls.off('a');
    emit('keypress', 'k');

    expect(callback).not.toHaveBeenCalled();
  });

  it('creates controls from the selected control scheme', () => {
    const controls = Controls.selected();
    const callback = vi.fn();

    controls.press('right', callback);
    emit('keypress', 'd');

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
