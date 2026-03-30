import { afterEach, describe, expect, it, vi } from 'vitest';
import { Scene } from './scene';
import { Entity } from './entity';
import { Controls } from '../traits';

class TestScene extends Scene {
  constructor(private rendered: Entity.Container) {
    super();
  }
  protected render(): Entity.Container {
    return this.rendered;
  }
}

describe('Scene', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('clears controls and destroys rendered entity on destroy', () => {
    const rendered = Entity.container();
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
    const rendered = Entity.container();
    const scene = new TestScene(rendered);

    expect(() => scene.destroy()).not.toThrow();
  });
});
