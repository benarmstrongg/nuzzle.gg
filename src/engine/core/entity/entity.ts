import { GameObject } from '../object';
import { State } from '../../traits';
import { cover, draggable, log } from '../../debug';
import { Transform } from '../transform';
import { Container } from "./container";
import { Sprite } from "./sprite";
import { Text } from "./text";
import { containerFactory } from "./container/factory";
import { textFactory } from "./text/factory";
import { spriteFactory } from "./sprite/factory";

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