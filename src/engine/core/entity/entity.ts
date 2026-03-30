import { GameObject } from '../object';
import { State } from '../../traits';
import { cover, draggable, log } from '../../debug';
import { Transform } from '../transform';
import { containerFactory } from './container/factory';
import { textFactory } from './text/factory';
import { spriteFactory } from './sprite/factory';
import type { Container } from './container';
import type { Sprite } from './sprite';
import type { Text } from './text';
import { Scene } from '../scene';

export class Entity {
  private inner = new GameObject();

  private meta = new State({ ready: false, rendered: false });
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

  private _parent?: ContainerEntity;
  get parent(): ContainerEntity {
    if (!this._parent) {
      throw new Error('Cannot access parent of unrendered entity');
    }

    return this._parent;
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
    if (this.ready) return fn();

    const cb = (ready: boolean) => {
      if (ready === false) return;

      fn();
      this.meta.off('ready', cb);
    };
    this.meta.on('ready', cb);
  }

  render(container: ContainerEntity) {
    this._parent = container;
    this.meta.rendered = true;
  }

  onRender(fn: () => void) {
    if (this.meta.rendered) return fn();

    const cb = (rendered: boolean) => {
      if (rendered === false) return;
      fn();
      this.meta.off('rendered', cb);
    };
    this.meta.on('rendered', cb);
  }

  destroy() {
    this.inner.destroy();
  }

  debug() {
    return cover(draggable(log(this)));
  }

  static get Text(): typeof TextEntity {
    return TextEntity;
  }
  static get text(): typeof textFactory {
    return textFactory;
  }

  static get Container(): typeof ContainerEntity {
    return ContainerEntity;
  }
  static get container(): typeof containerFactory {
    return containerFactory;
  }

  static get Sprite(): typeof SpriteEntity {
    return SpriteEntity;
  }
  static get sprite(): typeof spriteFactory {
    return spriteFactory;
  }
}

abstract class ContainerEntity extends Entity {
  abstract container: Container;
}

abstract class SpriteEntity extends Entity {
  abstract sprite: Sprite;
}

abstract class TextEntity extends Entity {
  abstract text: Text;
}

export namespace Entity {
  export type Container = ContainerEntity;
  export type Sprite = SpriteEntity;
  export type Text = TextEntity;
}
