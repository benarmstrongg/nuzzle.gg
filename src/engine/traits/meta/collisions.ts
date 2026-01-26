import { Entity, Scene } from '../../core';
import { Array2d, ColliderEntity } from '../../types';
import { Collider } from './collider';

export class Collisions {
  private colliderListeners = new Map<
    ColliderEntity,
    { x: (value: number) => void; y: (value: number) => void }
  >();
  private grid: Array2d<Set<ColliderEntity> | null> = [];
  private activeCollisions = new Map<ColliderEntity, Set<ColliderEntity>>();

  constructor(scene: Scene) {
    scene.onLoad(() => {
      const { width, height } = scene.transform;
      this.grid = Array.from({ length: height }, () =>
        Array.from({ length: width }, () => null)
      );

      scene.container.descendants.forEach((child) => this.addEntity(child));
      scene.container.onDescendantAdded((child) => this.addEntity(child));
      scene.container.onDescendantRemoved((child) => this.removeEntity(child));
    });
  }

  private addEntity(entity: Entity) {
    if (!Collider.isCollider(entity) || this.colliderListeners.has(entity)) {
      return;
    }

    this.applyEntityToGrid(entity, 'add');
    this.activeCollisions.set(entity, new Set());

    const listeners = {
      x: (x: number) => this.onColliderMove(entity, 'x', x),
      y: (y: number) => this.onColliderMove(entity, 'y', y),
    };
    this.colliderListeners.set(entity, listeners);
    entity.transform.global.on('x', listeners.x);
    entity.transform.global.on('y', listeners.y);

    this.trackCollisions(entity);
  }

  private removeEntity(entity: Entity) {
    if (!Collider.isCollider(entity) || !this.colliderListeners.has(entity)) {
      return;
    }

    this.cleanupCollisions(entity);
    this.applyEntityToGrid(entity, 'remove');

    const listeners = this.colliderListeners.get(entity);
    if (!listeners) {
      return;
    }
    this.colliderListeners.delete(entity);
    entity.transform.off('x', listeners.x);
    entity.transform.off('y', listeners.y);
  }

  private onColliderMove(
    entity: ColliderEntity,
    axis: 'x' | 'y',
    value: number
  ) {
    console.count('onColliderMove');
    const { globalX: x, globalY: y, width, height } = entity.transform;
    const oldPos = axis === 'x' ? x : y;
    const newPos = value;

    if (oldPos === newPos) {
      return;
    }

    const size = axis === 'x' ? width : height;
    const oldStart = Math.floor(oldPos);
    const oldEnd = Math.floor(oldPos + size - 1);
    const newStart = Math.floor(newPos);
    const newEnd = Math.floor(newPos + size - 1);

    const oldXStart = axis === 'x' ? oldStart : Math.floor(x);
    const oldXEnd = axis === 'x' ? oldEnd : Math.floor(x + width - 1);
    const newXStart = axis === 'x' ? newStart : Math.floor(x);
    const newXEnd = axis === 'x' ? newEnd : Math.floor(x + width - 1);
    const oldYStart = axis === 'y' ? oldStart : Math.floor(y);
    const oldYEnd = axis === 'y' ? oldEnd : Math.floor(y + height - 1);
    const newYStart = axis === 'y' ? newStart : Math.floor(y);
    const newYEnd = axis === 'y' ? newEnd : Math.floor(y + height - 1);

    for (let gridY = oldYStart; gridY <= oldYEnd; gridY++) {
      // Skip if the cell is out of bounds
      if (gridY < 0 || gridY >= this.grid.length) continue;

      // Skip if the cell is in the overlap region
      if (
        axis === 'y' &&
        gridY >= Math.max(oldYStart, newYStart) &&
        gridY <= Math.min(oldYEnd, newYEnd)
      ) {
        continue;
      }

      for (let gridX = oldXStart; gridX <= oldXEnd; gridX++) {
        // Skip if the cell is out of bounds
        if (gridX < 0 || gridX >= this.grid[gridY].length) continue;

        // Skip if the cell is in the overlap region
        if (
          axis === 'x' &&
          gridX >= Math.max(oldXStart, newXStart) &&
          gridX <= Math.min(oldXEnd, newXEnd)
        ) {
          continue;
        }

        this.removeFromCell(entity, gridX, gridY);
      }
    }

    for (let gridY = newYStart; gridY <= newYEnd; gridY++) {
      // Skip if the cell is out of bounds
      if (gridY < 0 || gridY >= this.grid.length) continue;

      // Skip if the cell is in the overlap region
      if (
        axis === 'y' &&
        gridY >= Math.max(oldYStart, newYStart) &&
        gridY <= Math.min(oldYEnd, newYEnd)
      ) {
        continue;
      }

      for (let gridX = newXStart; gridX <= newXEnd; gridX++) {
        // Skip if the cell is out of bounds
        if (gridX < 0 || gridX >= this.grid[gridY].length) continue;

        // Skip if the cell is in the overlap region
        if (
          axis === 'x' &&
          gridX >= Math.max(oldXStart, newXStart) &&
          gridX <= Math.min(oldXEnd, newXEnd)
        ) {
          continue;
        }

        this.addToCell(entity, gridX, gridY);
      }
    }

    this.trackCollisions(entity);
  }

  private trackCollisions(entity: ColliderEntity) {
    const { globalX: x, globalY: y, width, height } = entity.transform;
    const xStart = Math.floor(x);
    const xEnd = Math.floor(x + width - 1);
    const yStart = Math.floor(y);
    const yEnd = Math.floor(y + height - 1);

    // Use grid to find potential collision candidates (narrow phase)
    const candidates = new Set<ColliderEntity>();
    for (let gridY = yStart; gridY <= yEnd; gridY++) {
      if (gridY < 0 || gridY >= this.grid.length) continue;
      for (let gridX = xStart; gridX <= xEnd; gridX++) {
        if (gridX < 0 || gridX >= this.grid[gridY].length) continue;
        const cell = this.grid[gridY][gridX];
        if (!cell) continue;
        cell.forEach((other) => {
          if (other !== entity) {
            candidates.add(other);
          }
        });
      }
    }

    let activeCollisions = this.activeCollisions.get(entity);
    if (!activeCollisions) {
      activeCollisions = new Set();
      this.activeCollisions.set(entity, activeCollisions);
    }

    // Check each candidate for actual collision (broad phase)
    candidates.forEach((other) => {
      const isColliding = this.checkAABBCollision(entity, other);
      const wasColliding = activeCollisions.has(other);

      if (isColliding && !wasColliding) {
        // Start colliding
        activeCollisions.add(other);

        let otherActive = this.activeCollisions.get(other);
        if (!otherActive) {
          otherActive = new Set();
          this.activeCollisions.set(other, otherActive);
        }

        this.activeCollisions.set(other, otherActive);
        otherActive.add(entity);
        entity.collider.enter(other);
        other.collider.enter(entity);
      } else if (!isColliding && wasColliding) {
        // Stop colliding
        activeCollisions.delete(other);
        const otherActive = this.activeCollisions.get(other);
        if (otherActive) {
          otherActive.delete(entity);
        }
        entity.collider.exit(other);
        other.collider.exit(entity);
      }
    });

    // Check entities we were colliding with but are no longer in candidate cells
    // (they might have moved out of shared cells but we need to verify)
    activeCollisions.forEach((other) => {
      if (!candidates.has(other)) {
        const isColliding = this.checkAABBCollision(entity, other);
        if (!isColliding) {
          activeCollisions.delete(other);
          const otherActive = this.activeCollisions.get(other);
          if (otherActive) {
            otherActive.delete(entity);
          }
          entity.collider.exit(other);
          other.collider.exit(entity);
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

  private applyEntityToGrid(entity: ColliderEntity, action: 'add' | 'remove') {
    const { globalX: x, globalY: y, width, height } = entity.transform;
    const xStart = Math.floor(x);
    const xEnd = Math.floor(x + width - 1);
    const yStart = Math.floor(y);
    const yEnd = Math.floor(y + height - 1);

    for (let gridY = yStart; gridY <= yEnd; gridY++) {
      // Skip if the cell is out of bounds
      if (gridY < 0 || gridY >= this.grid.length) continue;

      for (let gridX = xStart; gridX <= xEnd; gridX++) {
        // Skip if the cell is out of bounds
        if (gridX < 0 || gridX >= this.grid[gridY].length) continue;

        if (action === 'add') {
          this.addToCell(entity, gridX, gridY);
        } else {
          this.removeFromCell(entity, gridX, gridY);
        }
      }
    }
  }

  private addToCell(entity: ColliderEntity, gridX: number, gridY: number) {
    const cell = this.grid[gridY][gridX] ?? new Set<ColliderEntity>();
    this.grid[gridY][gridX] ??= cell;
    cell.add(entity);
  }

  private removeFromCell(entity: ColliderEntity, gridX: number, gridY: number) {
    const cell = this.grid[gridY][gridX];

    if (!cell) return;

    cell.delete(entity);

    if (cell.size === 0) {
      this.grid[gridY][gridX] = null;
    }
  }

  private cleanupCollisions(entity: ColliderEntity) {
    const activeCollisions = this.activeCollisions.get(entity);

    if (!activeCollisions) return;

    activeCollisions.forEach((otherEntity) => {
      const otherCollisions = this.activeCollisions.get(otherEntity);
      if (otherCollisions) {
        otherCollisions.delete(entity);
      }
    });
    this.activeCollisions.delete(entity);
  }
}

export interface ICollisions {
  collisions: Collisions;
}
