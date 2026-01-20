import { ContainerLayout } from './utils/layout/layout';
import { Box } from './utils/box';
import { game, type Entity } from '../../../core';
import { Signal } from '../../meta';
import { GameObject } from '../../../core/object';

type ContainerSignal = {
  childAdded: Entity;
  childRemoved: Entity;
  cleared: never;
};

export type MaybeEntity = Entity | undefined | null | false;

export class Container {
  private inner = new GameObject();
  private box = new Box(0, 0);
  children: Entity[] = [];
  private signal = new Signal<ContainerSignal>();
  layout: ContainerLayout;

  private _height?: number;
  private _width?: number;

  constructor(private entity: Entity, ...children: MaybeEntity[]) {
    entity['inner'] = this.inner;
    this.layout = new ContainerLayout(this, this.entity);

    this.add(...children);

    this.entity.transform.on('width', (width) => {
      this._width = width;
      this.setBoundingBox();
    });
    this.entity.transform.on('height', (height) => {
      this._height = height;
      this.setBoundingBox();
    });

    // TODO: this works but i'd rather have it be event based, idk why that's breaking rn
    game.tick((done) => {
      if (!this.children.every((child) => child.ready)) return;

      this.entity.ready = true;
      done();
    });
  }

  add(...entities: MaybeEntity[]) {
    if (!entities.length) return;

    this.entity.ready = false;

    entities.forEach((entity) => {
      if (!entity) return;

      this.inner.addChild(entity['inner']);
      this.children.push(entity);
      entity.onRender(this.entity);
      this.signal.emit('childAdded', entity);
      entity.onReady(() => this.onChildReadyChange());

      // TODO: this works but why? what is racing here? are events not firing?
      // setTimeout(() => entity.onReady(() => this.onChildReadyChange()), 1000);
    });

    const { width, height } = this.layout.calculateSize();
    this.entity.transform.set({
      width: this._width ?? width,
      height: this._height ?? height,
    });

    this.setBoundingBox();
    this.layout.apply();
  }

  // TODO: implement this
  remove() {}

  clear() {
    this.inner.removeChildren();
    this.inner.addChild(this.box['inner']);
    this.children = [];
    this.entity.ready = true;
    this.signal.emit('cleared');
  }

  onChildAdded(listener: (entity: Entity) => void) {
    this.signal.on('childAdded', listener);
  }

  onChildRemoved(listener: (entity: Entity) => void) {
    this.signal.on('childRemoved', listener);
  }

  onCleared(listener: () => void) {
    this.signal.on('cleared', listener);
  }

  private setBoundingBox() {
    this.inner.removeChild(this.box.inner);
    this.box = new Box(
      this.entity.transform.width,
      this.entity.transform.height
    );
    this.inner.addChildAt(this.box.inner, 0);
  }

  private onChildReadyChange() {
    if (!this.children.every((entity) => entity.ready)) return;

    this.entity.ready = true;
  }
}

export interface IContainer {
  container: Container;
}
