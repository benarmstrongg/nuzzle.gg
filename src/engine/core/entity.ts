import { GameObject } from './object';
import { containerFactory, spriteFactory, State } from '../traits';
import { cover, draggable, log } from '../debug';
import { textFactory } from '../traits/entity/text';
import { Transform } from './transform';
import { Scene } from './scene';

export class Entity {
  private inner = new GameObject();

  private meta = new State({ ready: false });
  transform = new Transform(this);

  get ready(): boolean {
    return this.meta.ready;
  }
  set ready(ready: boolean) {
    this.meta.ready = ready;
  }

  get visible(): boolean {
    return this.inner.visible;
  }
  set visible(visible: boolean) {
    this.inner.visible = visible;
  }

  private parentContainer?: Entity;
  get parent(): Entity {
    if (!this.parentContainer) {
      throw new Error('Cannot access parent of unrendered entity');
    }

    return this.parentContainer;
  }

  get scene(): Scene {
    let current: Entity = this;
    while (current) {
      if (Scene.isSceneEntity(current)) {
        return current._scene;
      }
      current = current.parent;
    }

    throw new Error('Entity is not a child of a scene');
  }

  constructor() {
    // setTimeout(() => {
    //   if (!this.ready) console.log('not ready', this);
    // }, 5_000);
  }

  onReady(fn: () => void) {
    if (this.ready) fn();

    this.meta.once('ready', (ready) => {
      if (ready === false) return;
      fn();
    });
  }

  onRender(parent: Entity) {
    this.parentContainer = parent;
  }

  destroy() {
    this.inner.destroy();
  }

  debug() {
    return cover(draggable(log(this)));
  }

  static get text(): typeof textFactory {
    return textFactory;
  }

  static get container(): typeof containerFactory {
    return containerFactory;
  }

  static get sprite(): typeof spriteFactory {
    return spriteFactory;
  }
}
