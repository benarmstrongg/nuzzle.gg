import { describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  unloadScene: vi.fn(),
  controlsClear: vi.fn(),
}));

vi.mock('./game', () => ({
  game: { unloadScene: mocks.unloadScene, tick: vi.fn() },
}));

vi.mock('../traits', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../traits')>();
  return {
    ...actual,
    Controls: { ...actual.Controls, clear: mocks.controlsClear },
    Container: class {
      children: any[] = [];
      add = vi.fn((entity: any) => this.children.push(entity));
      clear = vi.fn(() => {
        this.children = [];
      });
      constructor(_entity: any) {}
    },
  };
});

import { Scene } from './scene';
import { Entity } from './entity';

class TestScene extends Scene {
  constructor(private rendered: Entity) {
    super();
  }
  protected render(): Entity {
    return this.rendered;
  }
}

describe('Scene', () => {
  it('unloads active scene when constructed', () => {
    const rendered = new Entity();
    new TestScene(rendered);
    expect(mocks.unloadScene).toHaveBeenCalledTimes(1);
  });

  it('loads rendered entity and swaps once ready', () => {
    const rendered = new Entity();
    const scene = new TestScene(rendered);

    scene.load();
    expect(scene.container.clear).not.toHaveBeenCalled();
    rendered.ready = true;
    rendered.onReady(() => {});

    // triggers from Scene.load onReady callback
    expect(scene.container.clear).toHaveBeenCalledTimes(1);
    expect(scene.container.add).toHaveBeenCalledWith(rendered);
  });

  it('clears controls and destroys rendered entity on destroy', () => {
    const rendered = new Entity();
    rendered.ready = true;
    const destroySpy = vi.spyOn(rendered, 'destroy');
    const scene = new TestScene(rendered);

    scene.load();
    scene.destroy();

    expect(mocks.controlsClear).toHaveBeenCalledTimes(1);
    expect(destroySpy).toHaveBeenCalled();
  });

  it.skip('does not throw when destroyed before load is called', () => {
    const rendered = new Entity();
    const scene = new TestScene(rendered);

    expect(() => scene.destroy()).not.toThrow();
  });
});
