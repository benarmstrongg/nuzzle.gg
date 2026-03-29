import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  init: vi.fn(async () => {}),
  addChild: vi.fn(),
  removeChild: vi.fn(),
  addTicker: vi.fn(),
  removeTicker: vi.fn(),
  destroyTicker: vi.fn(),
  append: vi.fn(),
}));

vi.mock('pixi.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('pixi.js')>();
  return {
    ...actual,
    Application: class {
      canvas = {};
      stage = { addChild: mocks.addChild, removeChild: mocks.removeChild };
      ticker = new (class {
        autoStart = false;
        add = mocks.addTicker;
        remove = mocks.removeTicker;
        destroy = mocks.destroyTicker;
      })();
      init = mocks.init;
    },
    Ticker: class {
      autoStart = false;
      add = mocks.addTicker;
      remove = mocks.removeTicker;
      destroy = mocks.destroyTicker;
    },
    Assets: {
      addBundle: vi.fn(),
      loadBundle: vi.fn(async () => ({})),
    },
  };
});

Object.assign(globalThis, {
  window: {},
  document: { body: { append: mocks.append } },
});

import { game } from './game';

describe('game', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (game as any).inner = undefined;
    game.activeScene = null;
  });

  it('initializes pixi app and appends canvas once', async () => {
    await game.init();
    await game.init();

    expect(mocks.init).toHaveBeenCalledTimes(1);
    expect(mocks.append).toHaveBeenCalledTimes(1);
    expect(game.fonts).toBeTruthy();
  });

  it('loads and unloads scenes', async () => {
    await game.init();
    const scene = {
      load: vi.fn(),
      destroy: vi.fn(),
      container: { inner: { id: 'scene-inner' } },
    } as any;

    game.loadScene(scene);
    expect(scene.load).toHaveBeenCalledTimes(1);
    expect(mocks.addChild).toHaveBeenCalledWith(scene.container.inner);
    expect(game.activeScene).toBe(scene);

    game.unloadScene();
    expect(mocks.removeChild).toHaveBeenCalledWith(scene.container.inner);
    expect(scene.destroy).toHaveBeenCalledTimes(1);
    expect(game.activeScene).toBeNull();
    expect(mocks.destroyTicker).toHaveBeenCalledTimes(1);
  });

  it('registers ticker callbacks and done removes callback', async () => {
    await game.init();
    const fn = vi.fn((done: () => void) => done());

    game.tick(fn);
    const callback = mocks.addTicker.mock.calls[0][0];
    callback();

    expect(fn).toHaveBeenCalledTimes(1);
    expect(mocks.removeTicker).toHaveBeenCalledWith(callback);
  });

  it('wait resolves after timeout', async () => {
    vi.useFakeTimers();
    const promise = game.wait(10);
    vi.advanceTimersByTime(10);
    await expect(promise).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});
