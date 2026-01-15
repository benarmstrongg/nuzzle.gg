import { GameObject } from './object';
import {
  containerFactory,
  ISprite,
  Sprite,
  SpriteOptions,
  State,
} from '../traits';
import { cover, draggable, log } from '../debug';
import { textFactory } from '../traits/entity/text';
import { Transform } from './transform';

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

  static get container(): typeof containerFactory {
    return containerFactory;
  }

  static sprite<TFrame extends string, TAnimation extends string>(
    options: SpriteOptions<TFrame, TAnimation>
  ): Entity & ISprite {
    return new (class extends Entity implements ISprite {
      sprite = new Sprite<TFrame, TAnimation>(this, options);
    })();
  }
}
