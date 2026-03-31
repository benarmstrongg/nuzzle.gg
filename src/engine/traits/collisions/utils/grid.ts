import { Coordinate } from 'nuzzlengine/core/transform';
import { Array2d, ColliderEntity } from '../../../types';

export class CollisionsGrid {
  private grid: Array2d<Set<ColliderEntity> | null> = [];

  maxY(): number {
    return this.grid.length;
  }

  maxX(row: number): number {
    return this.grid[row].length;
  }

  init(width: number, height: number) {
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => null)
    );
  }

  get(gridX: number, gridY: number): Set<ColliderEntity> | null {
    return this.grid[gridY][gridX];
  }

  add(entity: ColliderEntity, gridX: number, gridY: number) {
    const cell = this.grid[gridY][gridX] ?? new Set<ColliderEntity>();
    this.grid[gridY][gridX] ??= cell;
    cell.add(entity);
  }

  remove(entity: ColliderEntity, gridX: number, gridY: number) {
    const cell = this.grid[gridY][gridX];

    if (!cell) return;

    cell.delete(entity);

    if (cell.size === 0) {
      this.grid[gridY][gridX] = null;
    }
  }

  update(entity: ColliderEntity, action: 'add' | 'remove') {
    const { globalX: x, globalY: y, width, height } = entity.transform;
    const xStart = Math.floor(x);
    const xEnd = Math.ceil(x + width) - 1;
    const yStart = Math.floor(y);
    const yEnd = Math.ceil(y + height) - 1;

    for (let gridY = yStart; gridY <= yEnd; gridY++) {
      // Skip if the cell is out of bounds
      if (gridY < 0 || gridY >= this.grid.length) continue;

      for (let gridX = xStart; gridX <= xEnd; gridX++) {
        // Skip if the cell is out of bounds
        if (gridX < 0 || gridX >= this.grid[gridY].length) continue;

        if (action === 'add') {
          this.add(entity, gridX, gridY);
        } else {
          this.remove(entity, gridX, gridY);
        }
      }
    }
  }

  getOverlap(entity: ColliderEntity): Set<ColliderEntity> {
    const { globalX: x, globalY: y, width, height } = entity.transform;
    const xStart = Math.floor(x);
    const xEnd = Math.ceil(x + width) - 1;
    const yStart = Math.floor(y);
    const yEnd = Math.ceil(y + height) - 1;

    const overlappingEntities = new Set<ColliderEntity>();
    for (let gridY = yStart; gridY <= yEnd; gridY++) {
      if (gridY < 0 || gridY >= this.maxY()) continue;
      for (let gridX = xStart; gridX <= xEnd; gridX++) {
        if (gridX < 0 || gridX >= this.maxX(gridY)) continue;
        const cell = this.get(gridX, gridY);
        if (!cell) continue;
        cell.forEach((other) => {
          if (other !== entity) {
            overlappingEntities.add(other);
          }
        });
      }
    }

    return overlappingEntities;
  }

  trackMove(entity: ColliderEntity, previous: Coordinate, current: Coordinate) {
    const { x, y } = previous;
    const { width, height } = entity.transform;
    const axis = current.x !== x ? 'x' : 'y';
    const oldPos = axis === 'x' ? x : y;
    const newPos = axis === 'x' ? current.x : current.y;

    if (oldPos === newPos) return;
    const size = axis === 'x' ? width : height;
    const oldStart = Math.floor(oldPos);
    const oldEnd = Math.ceil(oldPos + size) - 1;
    const newStart = Math.floor(newPos);
    const newEnd = Math.ceil(newPos + size) - 1;

    const oldXStart = axis === 'x' ? oldStart : Math.floor(x);
    const oldXEnd = axis === 'x' ? oldEnd : Math.ceil(x + width) - 1;
    const newXStart = axis === 'x' ? newStart : Math.floor(x);
    const newXEnd = axis === 'x' ? newEnd : Math.ceil(x + width) - 1;
    const oldYStart = axis === 'y' ? oldStart : Math.floor(y);
    const oldYEnd = axis === 'y' ? oldEnd : Math.ceil(y + height) - 1;
    const newYStart = axis === 'y' ? newStart : Math.floor(y);
    const newYEnd = axis === 'y' ? newEnd : Math.ceil(y + height) - 1;

    for (let gridY = oldYStart; gridY <= oldYEnd; gridY++) {
      // Skip if the cell is out of bounds
      if (gridY < 0 || gridY >= this.maxY()) continue;

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
        if (gridX < 0 || gridX >= this.maxX(gridY)) continue;

        // Skip if the cell is in the overlap region
        if (
          axis === 'x' &&
          gridX >= Math.max(oldXStart, newXStart) &&
          gridX <= Math.min(oldXEnd, newXEnd)
        ) {
          continue;
        }

        this.remove(entity, gridX, gridY);
      }
    }

    for (let gridY = newYStart; gridY <= newYEnd; gridY++) {
      // Skip if the cell is out of bounds
      if (gridY < 0 || gridY >= this.maxY()) continue;

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
        if (gridX < 0 || gridX >= this.maxX(gridY)) continue;

        // Skip if the cell is in the overlap region
        if (
          axis === 'x' &&
          gridX >= Math.max(oldXStart, newXStart) &&
          gridX <= Math.min(oldXEnd, newXEnd)
        ) {
          continue;
        }

        this.add(entity, gridX, gridY);
      }
    }
  }
}
