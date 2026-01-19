import { Entity } from '../../core';

type ColliderOptions = {
  onEnter?: (entity: Entity) => void;
  onExit?: (entity: Entity) => void;
};

export class Collider {
  static isCollider(entity: Entity): entity is Entity & ICollider {
    return (
      !!entity && 'collider' in entity && entity.collider instanceof Collider
    );
  }
  private onEnter?: (entity: Entity) => void;
  private onExit?: (entity: Entity) => void;

  constructor(_entity: Entity, { onEnter, onExit }: ColliderOptions = {}) {
    this.onEnter = onEnter;
    this.onExit = onExit;
  }

  enter(entity: Entity) {
    console.log('enter', entity);
    this.onEnter?.(entity);
  }

  exit(entity: Entity) {
    console.log('exit', entity);
    this.onExit?.(entity);
  }
}

export interface ICollider {
  collider: Collider;
}
