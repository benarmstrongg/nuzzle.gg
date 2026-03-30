import { Entity } from '../core';
import { ColliderEntity } from '../types';

type ColliderOptions = {
  solid?: boolean;
  onEnter?: (entity: ColliderEntity) => void;
  onExit?: (entity: ColliderEntity) => void;
};

export class Collider {
  static isCollider(entity: Entity): entity is Entity & ICollider {
    return (
      !!entity && 'collider' in entity && entity.collider instanceof Collider
    );
  }
  readonly solid: boolean;
  private readonly onEnter?: (entity: ColliderEntity) => void;
  private readonly onExit?: (entity: ColliderEntity) => void;
  private readonly collidingWith = new Set<ColliderEntity>();

  constructor(
    _entity: Entity,
    { solid = false, onEnter, onExit }: ColliderOptions = {}
  ) {
    this.solid = solid;
    this.onEnter = onEnter;
    this.onExit = onExit;
  }

  enter(entity: ColliderEntity) {
    this.onEnter?.(entity);
    this.collidingWith.add(entity);
  }

  exit(entity: ColliderEntity) {
    this.onExit?.(entity);
    this.collidingWith.delete(entity);
  }

  isCollidingWith(entity: ColliderEntity) {
    return this.collidingWith.has(entity);
  }
}

export interface ICollider {
  collider: Collider;
}
