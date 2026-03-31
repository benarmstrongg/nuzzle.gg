import { Coordinate, Entity, Scene } from '../../core';
import { ColliderEntity } from '../../types';
import { Collider } from '../collider';
import { CollisionsGrid } from './utils/grid';
import { ActiveCollisions } from './utils/active';

export class Collisions {
  private colliderListeners = new Map<
    ColliderEntity,
    ([current, previous]: [Coordinate, Coordinate]) => void
  >();
  private grid = new CollisionsGrid();
  private activeCollisions = new ActiveCollisions();

  constructor(scene: Scene) {
    scene.onLoad(() => {
      const { width, height } = scene.transform;
      this.grid.init(width, height);

      scene.container.descendants.forEach((child) => this.addEntity(child));
      scene.container.onDescendantAdded((child) => this.addEntity(child));
      scene.container.onDescendantRemoved((child) => this.removeEntity(child));
    });
  }

  private hasEntity(entity: ColliderEntity) {
    return this.colliderListeners.has(entity);
  }

  private addEntity(entity: Entity) {
    if (!Collider.isCollider(entity) || this.hasEntity(entity)) {
      return;
    }

    this.grid.update(entity, 'add');
    this.addMoveListener(entity);
    this.trackCollisions(entity);
  }

  private removeEntity(entity: Entity) {
    if (!Collider.isCollider(entity) || !this.hasEntity(entity)) {
      return;
    }

    this.grid.update(entity, 'remove');
    this.activeCollisions.cleanup(entity);
    this.removeMoveListener(entity);
  }

  private addMoveListener(entity: ColliderEntity) {
    const listener = ([current, previous]: [Coordinate, Coordinate]) =>
      this.onColliderMove(entity, current, previous);
    this.colliderListeners.set(entity, listener);
    entity.transform.global.onChange(listener);
  }

  private removeMoveListener(entity: ColliderEntity) {
    const listener = this.colliderListeners.get(entity);
    if (!listener) {
      return;
    }
    this.colliderListeners.delete(entity);
    entity.transform.global.offChange(listener);
  }

  private onColliderMove(
    entity: ColliderEntity,
    current: Coordinate,
    previous: Coordinate
  ) {
    this.grid.trackMove(entity, previous, current);
    this.trackCollisions(entity);
  }

  private trackCollisions(entity: ColliderEntity) {
    const activeCollisions = this.activeCollisions.getActiveCollisions(entity);
    const overlappingEntities = this.grid.getOverlap(entity);

    // Check each candidate for actual collision (broad phase)
    overlappingEntities.forEach((other) => {
      const isColliding = this.checkAABBCollision(entity, other);
      const wasColliding = activeCollisions.has(other);

      if (isColliding && !wasColliding) {
        this.activeCollisions.onEnter(entity, other);
      } else if (!isColliding && wasColliding) {
        this.activeCollisions.onExit(entity, other);
      }
    });

    // Check entities we were colliding with but are no longer in candidate cells
    // (they might have moved out of shared cells but we need to verify)
    activeCollisions.forEach((other) => {
      if (!overlappingEntities.has(other)) {
        const isColliding = this.checkAABBCollision(entity, other);
        if (!isColliding) {
          this.activeCollisions.onExit(entity, other);
        }
      }
    });
  }

  private checkAABBCollision(a: ColliderEntity, b: ColliderEntity): boolean {
    const {
      globalX: aX,
      globalY: aY,
      width: aWidth,
      height: aHeight,
    } = a.transform;
    const {
      globalX: bX,
      globalY: bY,
      width: bWidth,
      height: bHeight,
    } = b.transform;
    return (
      aX < bX + bWidth &&
      aX + aWidth > bX &&
      aY < bY + bHeight &&
      aY + aHeight > bY
    );
  }
}

export interface ICollisions {
  collisions: Collisions;
}
