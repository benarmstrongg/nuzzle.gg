import { Application, Ticker } from 'pixi.js';
import { describe, expect, it, vi } from 'vitest';
import { Collider, ICollider } from '../collider';
import { Collisions } from './collisions';
import { Entity, Scene } from '../../core';
import { game } from '../../core/game';
import { ColliderEntity } from '../../types';

class TestScene extends Scene {
  constructor(private _width = 50, private _height = 50) {
    super();
  }

  protected render() {
    return Entity.container.box({ width: this._width, height: this._height });
  }
}

function setup(width = 50, height = 50) {
  const scene = new TestScene(width, height);
  const collisions = new Collisions(scene);
  scene.load();
  return { scene, collisions };
}

function setupWithTicker(width = 50, height = 50) {
  const scene = new TestScene(width, height);
  const collisions = new Collisions(scene);

  const ticker = new Ticker();
  ticker.autoStart = false;
  game['inner'] ??= new Application();
  game['inner'].ticker = ticker;

  scene.load();

  let time = 0;
  const tick = (frames = 1) => {
    for (let i = 0; i < frames; i++) {
      time += 100;
      ticker.update(time);
    }
  };

  return { scene, collisions, tick };
}

function createCollider(
  options: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    onEnter?: (entity: ColliderEntity) => void;
    onExit?: (entity: ColliderEntity) => void;
  } = {}
) {
  const { x = 0, y = 0, width = 1, height = 1, onEnter, onExit } = options;
  return new (class extends Entity implements ICollider {
    collider = new Collider(this, { onEnter, onExit });

    constructor() {
      super();
      this.transform.set({ x, y, width, height });
    }
  })();
}

function getGrid(collisions: Collisions) {
  return (collisions as any).grid as (Set<ColliderEntity> | null)[][];
}

function cellEntities(
  collisions: Collisions,
  x: number,
  y: number
): Set<ColliderEntity> {
  const grid = getGrid(collisions);
  return grid[y]?.[x] ?? new Set();
}

describe('Collisions', () => {
  describe('collision enter', () => {
    it('fires enter event on both entities when transforms overlap on add', () => {
      const { scene } = setup();

      const enterA = vi.fn();
      const enterB = vi.fn();

      const a = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onEnter: enterA,
      });
      const b = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onEnter: enterB,
      });

      scene.container.add(a);
      scene.container.add(b);

      expect(enterA).toHaveBeenCalledWith(b);
      expect(enterB).toHaveBeenCalledWith(a);
    });

    it('fires enter when an entity moves into another', () => {
      const { scene } = setup();

      const enterA = vi.fn();
      const enterB = vi.fn();

      const a = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onEnter: enterA,
      });
      const b = createCollider({
        x: 15,
        y: 15,
        width: 2,
        height: 2,
        onEnter: enterB,
      });

      scene.container.add(a);
      scene.container.add(b);

      expect(enterA).not.toHaveBeenCalled();
      expect(enterB).not.toHaveBeenCalled();

      b.transform.set({ x: 5, y: 5 });

      expect(enterA).toHaveBeenCalledWith(b);
      expect(enterB).toHaveBeenCalledWith(a);
    });
  });

  describe('collision exit', () => {
    it('fires exit event on both entities when they stop overlapping', () => {
      const { scene } = setup();

      const exitA = vi.fn();
      const exitB = vi.fn();

      const a = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onExit: exitA,
      });
      const b = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onExit: exitB,
      });

      scene.container.add(a);
      scene.container.add(b);

      b.transform.set({ x: 15, y: 15 });

      expect(exitA).toHaveBeenCalledWith(b);
      expect(exitB).toHaveBeenCalledWith(a);
    });
  });

  describe('entity removal', () => {
    it('no longer detects collisions after an entity is removed from the grid', () => {
      const { scene } = setup();

      const enterA = vi.fn();
      const enterB = vi.fn();

      const a = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onEnter: enterA,
      });
      const b = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onEnter: enterB,
      });

      scene.container.add(a);
      scene.container.add(b);

      expect(enterA).toHaveBeenCalledTimes(1);
      expect(enterB).toHaveBeenCalledTimes(1);

      enterA.mockClear();
      enterB.mockClear();

      scene.container.remove(a);

      const enterC = vi.fn();
      const c = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onEnter: enterC,
      });
      scene.container.add(c);

      expect(enterA).not.toHaveBeenCalled();
      expect(enterB).toHaveBeenCalledWith(c);
      expect(enterC).toHaveBeenCalledWith(b);
    });
  });

  describe('entity addition', () => {
    it('immediately checks collisions and fires enter when added on top of an existing entity', () => {
      const { scene } = setup();

      const enterA = vi.fn();

      const a = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onEnter: enterA,
      });
      scene.container.add(a);

      expect(enterA).not.toHaveBeenCalled();

      const enterB = vi.fn();
      const b = createCollider({
        x: 5,
        y: 5,
        width: 2,
        height: 2,
        onEnter: enterB,
      });
      scene.container.add(b);

      expect(enterA).toHaveBeenCalledWith(b);
      expect(enterB).toHaveBeenCalledWith(a);
    });
  });

  describe('directional collision detection (tick-based walking)', () => {
    it('fires enter when walking right into collider', () => {
      const { scene, tick } = setupWithTicker();
      const enterPlayer = vi.fn();

      const wall = createCollider({ x: 10, y: 5, width: 1, height: 1 });
      const player = createCollider({
        x: 2,
        y: 5,
        width: 1,
        height: 1,
        onEnter: enterPlayer,
      });

      scene.container.add(wall);
      scene.container.add(player);

      player.transform.moveTo({ x: 12 }, 10);
      tick(10);

      expect(enterPlayer).toHaveBeenCalledWith(wall);
    });

    it('fires enter when walking left into collider', () => {
      const { scene, tick } = setupWithTicker();
      const enterPlayer = vi.fn();

      const wall = createCollider({ x: 10, y: 5, width: 1, height: 1 });
      const player = createCollider({
        x: 18,
        y: 5,
        width: 1,
        height: 1,
        onEnter: enterPlayer,
      });

      scene.container.add(wall);
      scene.container.add(player);

      player.transform.moveTo({ x: 8 }, 10);
      tick(10);

      expect(enterPlayer).toHaveBeenCalledWith(wall);
    });

    it('fires enter when walking down into collider', () => {
      const { scene, tick } = setupWithTicker();
      const enterPlayer = vi.fn();

      const wall = createCollider({ x: 5, y: 10, width: 1, height: 1 });
      const player = createCollider({
        x: 5,
        y: 2,
        width: 1,
        height: 1,
        onEnter: enterPlayer,
      });

      scene.container.add(wall);
      scene.container.add(player);

      player.transform.moveTo({ y: 12 }, 10);
      tick(10);

      expect(enterPlayer).toHaveBeenCalledWith(wall);
    });

    it('fires enter when walking up into collider', () => {
      const { scene, tick } = setupWithTicker();
      const enterPlayer = vi.fn();

      const wall = createCollider({ x: 5, y: 10, width: 1, height: 1 });
      const player = createCollider({
        x: 5,
        y: 18,
        width: 1,
        height: 1,
        onEnter: enterPlayer,
      });

      scene.container.add(wall);
      scene.container.add(player);

      player.transform.moveTo({ y: 8 }, 10);
      tick(10);

      expect(enterPlayer).toHaveBeenCalledWith(wall);
    });
  });

  describe('grid accuracy', () => {
    it('entity occupies exactly the correct grid cells for its position and size', () => {
      const { scene, collisions } = setup();

      const entity = createCollider({ x: 3, y: 3, width: 2, height: 2 });
      scene.container.add(entity);

      const e = entity as ColliderEntity;

      expect(cellEntities(collisions, 3, 3).has(e)).toBe(true);
      expect(cellEntities(collisions, 4, 3).has(e)).toBe(true);
      expect(cellEntities(collisions, 3, 4).has(e)).toBe(true);
      expect(cellEntities(collisions, 4, 4).has(e)).toBe(true);

      expect(cellEntities(collisions, 2, 3).has(e)).toBe(false);
      expect(cellEntities(collisions, 5, 3).has(e)).toBe(false);
      expect(cellEntities(collisions, 3, 2).has(e)).toBe(false);
      expect(cellEntities(collisions, 3, 5).has(e)).toBe(false);
    });

    it('grid updates when entity moves', () => {
      const { scene, collisions } = setup();

      const entity = createCollider({ x: 3, y: 3, width: 2, height: 2 });
      scene.container.add(entity);

      entity.transform.set({ x: 10, y: 10 });

      const e = entity as ColliderEntity;

      expect(cellEntities(collisions, 3, 3).has(e)).toBe(false);
      expect(cellEntities(collisions, 4, 3).has(e)).toBe(false);
      expect(cellEntities(collisions, 3, 4).has(e)).toBe(false);
      expect(cellEntities(collisions, 4, 4).has(e)).toBe(false);

      expect(cellEntities(collisions, 10, 10).has(e)).toBe(true);
      expect(cellEntities(collisions, 11, 10).has(e)).toBe(true);
      expect(cellEntities(collisions, 10, 11).has(e)).toBe(true);
      expect(cellEntities(collisions, 11, 11).has(e)).toBe(true);
    });

    it('grid clears entity cells on removal', () => {
      const { scene, collisions } = setup();

      const entity = createCollider({ x: 3, y: 3, width: 2, height: 2 });
      scene.container.add(entity);

      scene.container.remove(entity);

      const e = entity as ColliderEntity;
      expect(cellEntities(collisions, 3, 3).has(e)).toBe(false);
      expect(cellEntities(collisions, 4, 3).has(e)).toBe(false);
      expect(cellEntities(collisions, 3, 4).has(e)).toBe(false);
      expect(cellEntities(collisions, 4, 4).has(e)).toBe(false);
    });

    it('supports multiple entities in the same cell', () => {
      const { scene, collisions } = setup();

      const a = createCollider({ x: 5, y: 5, width: 1, height: 1 });
      const b = createCollider({ x: 5, y: 5, width: 1, height: 1 });

      scene.container.add(a);
      scene.container.add(b);

      const cell = cellEntities(collisions, 5, 5);
      expect(cell.has(a as ColliderEntity)).toBe(true);
      expect(cell.has(b as ColliderEntity)).toBe(true);
      expect(cell.size).toBe(2);
    });

    it('reflects single-axis position changes', () => {
      const { scene, collisions } = setup();

      const entity = createCollider({ x: 3, y: 3, width: 1, height: 1 });
      scene.container.add(entity);

      const e = entity as ColliderEntity;

      entity.transform.x = 7;

      expect(cellEntities(collisions, 3, 3).has(e)).toBe(false);
      expect(cellEntities(collisions, 7, 3).has(e)).toBe(true);

      entity.transform.y = 8;

      expect(cellEntities(collisions, 7, 3).has(e)).toBe(false);
      expect(cellEntities(collisions, 7, 8).has(e)).toBe(true);
    });

    it('correctly handles a sequence of moves', () => {
      const { scene, collisions } = setup();

      const entity = createCollider({ x: 0, y: 0, width: 1, height: 1 });
      scene.container.add(entity);

      const e = entity as ColliderEntity;

      for (let i = 1; i <= 5; i++) {
        entity.transform.set({ x: i, y: i });
        expect(cellEntities(collisions, i, i).has(e)).toBe(true);
        expect(cellEntities(collisions, i - 1, i - 1).has(e)).toBe(false);
      }
    });
  });
});
