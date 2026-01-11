import { Entity, Scene } from '../../core';
import { Array2d } from '../../types';
import { Collider, ICollider } from './collider';

type ColliderEntity = Entity & ICollider;

export class Collisions {
  private colliders = new Set<ColliderEntity>();
  private grid: Array2d<Set<ColliderEntity>> = [];

  constructor(private scene: Scene) {
    const { width, height } = this.scene.transform;
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Set<ColliderEntity>())
    );

    scene.container.onChildAdded((child) => {
      if (child && Collider.isCollider(child) && !this.colliders.has(child)) {
        this.colliders.add(child);
        this.addEntityToGrid(child);

        child.transform.on('x', (x) => this.onColliderMove(child, 'x', x));
        child.transform.on('y', (y) => this.onColliderMove(child, 'y', y));
      }
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

  private addEntityToGrid(entity: ColliderEntity) {
    const { x, y, width, height } = entity.transform;
    const xStart = Math.floor(x);
    const xEnd = Math.floor(x + width - 1);
    const yStart = Math.floor(y);
    const yEnd = Math.floor(y + height - 1);

    for (let gridY = yStart; gridY <= yEnd; gridY++) {
      if (gridY < 0 || gridY >= this.grid.length) continue;
      for (let gridX = xStart; gridX <= xEnd; gridX++) {
        if (gridX < 0 || gridX >= this.grid[gridY].length) continue;

        this.grid[gridY][gridX].add(entity);
      }
    }
  }
}

export interface ICollisions {
  collisions: Collisions;
}
