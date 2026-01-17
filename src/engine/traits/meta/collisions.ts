import { Entity } from '../../core';
import { Array2d } from '../../types';
import { IContainer } from '../entity';
import { Collider, ICollider } from './collider';

type ColliderEntity = Entity & ICollider;

export class Collisions {
  private colliders = new Map<
    ColliderEntity,
    { x: (value: number) => void; y: (value: number) => void }
  >();
  private grid: Array2d<Set<ColliderEntity>> = [];

  constructor(entity: Entity & IContainer) {
    if (!entity.container) {
      throw new Error(
        'Entity must have a container. Ensure container is initialized before collisions.'
      );
    }

    const { width, height } = entity['inner'];
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Set<ColliderEntity>())
    );

    entity.container.onChildAdded((child) => {
      if (!child || !Collider.isCollider(child) || this.colliders.has(child)) {
        return;
      }

      this.applyEntityToGrid(child, 'add');

      const listeners = {
        x: (x: number) => this.onColliderMove(child, 'x', x),
        y: (y: number) => this.onColliderMove(child, 'y', y),
      };
      this.colliders.set(child, listeners);
      child.transform.on('x', listeners.x);
      child.transform.on('y', listeners.y);
    });

    entity.container.onChildRemoved((child) => {
      if (!child || !Collider.isCollider(child) || !this.colliders.has(child)) {
        return;
      }
      this.applyEntityToGrid(child, 'remove');

      const listeners = this.colliders.get(child);
      if (!listeners) {
        return;
      }

      this.colliders.delete(child);
      child.transform.off('x', listeners.x);
      child.transform.off('y', listeners.y);
    });
  }

  private onColliderMove(
    entity: ColliderEntity,
    axis: 'x' | 'y',
    value: number
  ) {
    this.updateGrid(entity, axis, value);
  }

  private updateGrid(entity: ColliderEntity, axis: 'x' | 'y', value: number) {
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

        this.grid[gridY][gridX].delete(entity);
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

        this.grid[gridY][gridX].add(entity);
      }
    }
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
