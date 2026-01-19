import { Entity, Scene } from '../../core';
import { Array2d } from '../../types';
import { Collider, ICollider } from './collider';

type ColliderEntity = Entity & ICollider;

export class Collisions {
  private colliderListeners = new Map<
    ColliderEntity,
    { x: (value: number) => void; y: (value: number) => void }
  >();
  private grid: Array2d<Set<ColliderEntity>> = [];

  constructor(scene: Scene) {
    if (!scene.container) {
      throw new Error(
        'Entity must have a container. Ensure Container is initialized before Collisions.'
      );
    }

    const { width, height } = scene.transform;
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Set<ColliderEntity>())
    );

    scene.container.onChildAdded((child) => this.onChildAdded(child));
    scene.container.onChildRemoved((child) => this.onChildRemoved(child));
    scene.container.children.forEach((child) => this.onChildAdded(child));
  }

  private onChildAdded(entity: Entity) {
    console.log('onChildAdded', entity);
    if (!Collider.isCollider(entity) || this.colliderListeners.has(entity)) {
      return;
    }

    this.applyEntityToGrid(entity, 'add');

    const listeners = {
      x: (x: number) => this.onColliderMove(entity, 'x', x),
      y: (y: number) => this.onColliderMove(entity, 'y', y),
    };
    this.colliderListeners.set(entity, listeners);
    entity.transform.on('x', listeners.x);
    entity.transform.on('y', listeners.y);
  }

  private onChildRemoved(entity: Entity) {
    if (!Collider.isCollider(entity) || !this.colliderListeners.has(entity)) {
      return;
    }

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
    const oldPos = entity.transform[axis];
    const newPos = value;

    if (oldPos === newPos) {
      return;
    }

    const { x, y, width, height } = entity.transform;
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

        const cell = this.grid[gridY][gridX];
        cell.delete(entity);
        this.onColliderExit(entity, cell);
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

        const cell = this.grid[gridY][gridX];
        cell.add(entity);
        this.onColliderEnter(entity, cell);
      }
    }
  }

  private onColliderEnter(entity: ColliderEntity, cell: Set<ColliderEntity>) {
    cell.forEach((cellEntity) => {
      if (cellEntity === entity) {
        return;
      }

      cellEntity.collider.enter(entity);
    });
  }

  private onColliderExit(entity: ColliderEntity, cell: Set<ColliderEntity>) {
    cell.forEach((cellEntity) => {
      if (cellEntity === entity) {
        return;
      }

      cellEntity.collider.exit(entity);
    });
  }

  private applyEntityToGrid(entity: ColliderEntity, action: 'add' | 'remove') {
    const { x, y, width, height } = entity.transform;
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
          this.grid[gridY][gridX].add(entity);
        } else {
          this.grid[gridY][gridX].delete(entity);
        }
      }
    }
  }
}

export interface ICollisions {
  collisions: Collisions;
}
