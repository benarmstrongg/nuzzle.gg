import { afterEach, describe, expect, it, vi } from 'vitest';
import { Scene } from './scene';
import { Entity } from './entity';
import { Controls } from "../traits";

class TestScene extends Scene {
  constructor(private rendered: Entity) {
    super();
  }
  protected render(): Entity {
    return this.rendered;
  }
}

describe('Scene', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads rendered entity and swaps once ready', () => {
    const rendered = new Entity();
    const scene = new TestScene(rendered);
    vi.spyOn(scene.container, 'clear');
    vi.spyOn(scene.container, 'add');

    scene.load();
    expect(scene.container.clear).not.toHaveBeenCalled();
    rendered.ready = true;

    expect(scene.container.clear).toHaveBeenCalledTimes(1);
    expect(scene.container.add).toHaveBeenCalledWith(rendered);
  });

  it('clears controls and destroys rendered entity on destroy', () => {
    const rendered = new Entity();
    rendered.ready = true;
    vi.spyOn(rendered, 'destroy');
    vi.spyOn(Controls, 'clear');
    const scene = new TestScene(rendered);

    scene.load();
    scene.destroy();

    expect(Controls.clear).toHaveBeenCalledTimes(1);
    expect(rendered.destroy).toHaveBeenCalled();
  });

  it('does not throw when destroyed before load is called', () => {
    const rendered = new Entity();
    const scene = new TestScene(rendered);

    expect(() => scene.destroy()).not.toThrow();
  });
});
