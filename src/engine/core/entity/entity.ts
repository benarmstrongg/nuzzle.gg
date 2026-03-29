import { GameObject } from '../object';
import { State } from '../../traits';
import { cover, draggable, log } from '../../debug';
import { textFactory } from '../../traits/entity/text';
import { Transform } from '../transform';
import { Container, containerFactory } from "./container";
import { Sprite, SpriteOptions } from "./sprite";

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

  destroy() {
    this.inner.destroy();
  }

  debug() {
    return cover(draggable(log(this)));
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
  static sprite<TFrame extends string, TAnimation extends string>(
    options: SpriteOptions<TFrame, TAnimation>
  ): SpriteEntity {
    return new (class extends SpriteEntity {
      sprite = new Sprite<TFrame, TAnimation>(this, options);
    })();
  }
}

export abstract class ContainerEntity extends Entity {
  abstract container: Container;
}

export abstract class SpriteEntity extends Entity {
  abstract sprite: Sprite;
}