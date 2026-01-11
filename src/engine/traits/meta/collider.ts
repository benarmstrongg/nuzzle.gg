import { Entity } from '../../core';

export class Collider {
  static isCollider(entity: Entity): entity is Entity & ICollider {
    return 'collider' in entity && entity.collider instanceof Collider;
  }

  constructor(private entity: Entity) {}
}

export interface ICollider {
  collider: Collider;
}
