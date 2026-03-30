import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Character } from './Character.entity';
import { game } from '../../../engine/core/game';
import { Collider, Entity, ICollider } from '../../../engine';
import { ColliderEntity } from '../../../engine/types';

// TODO: shoouldn't have to mock this from game module, not sure what to do about that rn
vi.mock(
  '../../../engine/core/entity/sprite/utils/loader',
  async (importOriginal) => {
    const { Texture } = await import('pixi.js');
    const actual = await importOriginal<
      typeof import('../../../engine/core/entity/sprite/utils/loader')
    >();
    /** Non-zero frame size so `updateTexture` sets layout-sized transforms. */
    const mockTexture = Texture.WHITE;
    return {
      ...actual,
      SpriteLoader: class {
        loadSprite = vi.fn().mockResolvedValue(mockTexture);
        loadSpritesheet = vi.fn().mockResolvedValue(mockTexture);
      },
    };
  }
);

function createCollider(
  options: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    solid?: boolean;
  } = {}
) {
  const { x = 0, y = 0, width = 1, height = 1, solid = false } = options;
  return new (class extends Entity implements ICollider {
    collider = new Collider(this, { solid });

    constructor() {
      super();
      this.transform.set({ x, y, width, height });
    }
  })();
}

function createCharacter() {
  const character = new Character('red');
  vi.spyOn(character.sprite.animation, 'play').mockImplementation(() => {});
  vi.spyOn(character.sprite.animation, 'stop').mockImplementation(() => {});
  character.transform.set({ x: 10, y: 10, width: 1, height: 1 });
  return character;
}

describe('Character', () => {
  beforeEach(() => {
    vi.spyOn(game, 'tick').mockImplementation((fn) => fn(() => {}));
  });

  describe('walk', () => {
    it('moves position in the correct direction', () => {
      const character = createCharacter();
      const startX = character.transform.x;

      character.walk('right');

      expect(character.transform.x).toBeGreaterThan(startX);
    });

    it('moves up (negative y)', () => {
      const character = createCharacter();
      const startY = character.transform.y;

      character.walk('up');

      expect(character.transform.y).toBeLessThan(startY);
    });

    it('moves left (negative x)', () => {
      const character = createCharacter();
      character.transform.set({ x: 30, y: 10 });
      const startX = character.transform.x;

      character.walk('left');

      expect(character.transform.x).toBeLessThan(startX);
    });

    it('moves down (positive y)', () => {
      const character = createCharacter();
      const startY = character.transform.y;

      character.walk('down');

      expect(character.transform.y).toBeGreaterThan(startY);
    });

    it('sets orientation to the walk direction', () => {
      const character = createCharacter();

      character.walk('left');

      expect(character.orientation).toBe('left');
    });
  });

  describe('stop', () => {
    it('halts movement and allows walking again', () => {
      const character = createCharacter();

      character.walk('right');

      character.stop();
      expect(character['walking']).toBe(false);
      expect(character.sprite.animation.stop).toHaveBeenCalled();
    });
  });

  describe('isFacing', () => {
    it('returns true when facing right and entity is to the right', () => {
      const character = createCharacter();
      character.walk('right');

      const wall = createCollider({ x: 20, y: 10 });
      expect((character as any).isFacing(wall)).toBe(true);
    });

    it('returns false when facing right and entity is to the left', () => {
      const character = createCharacter();
      character.walk('right');

      const wall = createCollider({ x: 2, y: 10 });
      expect((character as any).isFacing(wall)).toBe(false);
    });

    it('returns true when facing left and entity is to the left', () => {
      const character = createCharacter();
      character.walk('left');

      const wall = createCollider({ x: 2, y: 10 });
      expect((character as any).isFacing(wall)).toBe(true);
    });

    it('returns false when facing left and entity is to the right', () => {
      const character = createCharacter();
      character.walk('left');

      const wall = createCollider({ x: 20, y: 10 });
      expect((character as any).isFacing(wall)).toBe(false);
    });

    it('returns true when facing down and entity is below', () => {
      const character = createCharacter();
      character.walk('down');

      const wall = createCollider({ x: 10, y: 20 });
      expect((character as any).isFacing(wall)).toBe(true);
    });

    it('returns false when facing down and entity is above', () => {
      const character = createCharacter();
      character.walk('down');

      const wall = createCollider({ x: 10, y: 2 });
      expect((character as any).isFacing(wall)).toBe(false);
    });

    it('returns true when facing up and entity is above', () => {
      const character = createCharacter();
      character.walk('up');

      const wall = createCollider({ x: 10, y: 2 });
      expect((character as any).isFacing(wall)).toBe(true);
    });

    it('returns false when facing up and entity is below', () => {
      const character = createCharacter();
      character.walk('up');

      const wall = createCollider({ x: 10, y: 20 });
      expect(character.isFacing(wall)).toBe(false);
    });
  });

  describe('collision handling', () => {
    it('pushes back and stops when colliding with a solid entity the character is facing', () => {
      const character = createCharacter();
      character.walk('right');

      const posBeforeCollision = character.transform.x;
      const wall = createCollider({
        x: posBeforeCollision + 1,
        y: 10,
        solid: true,
      });

      character.collider.enter(wall as ColliderEntity);

      expect(character.transform.x).toBeLessThan(posBeforeCollision);
    });

    it('does not push back when colliding with a non-solid entity', () => {
      const character = createCharacter();
      character.walk('right');

      const posBeforeCollision = character.transform.x;
      const trigger = createCollider({
        x: posBeforeCollision + 1,
        y: 10,
        solid: false,
      });

      character.collider.enter(trigger as ColliderEntity);

      expect(character.transform.x).toBe(posBeforeCollision);
    });

    it('does not push back when the solid entity is behind the character', () => {
      const character = createCharacter();
      character.walk('right');

      const posBeforeCollision = character.transform.x;
      const wall = createCollider({ x: 0, y: 10, solid: true });

      character.collider.enter(wall as ColliderEntity);

      expect(character.transform.x).toBe(posBeforeCollision);
    });

    it('does not push back again for the same entity while already colliding', () => {
      const character = createCharacter();
      character.walk('right');

      const wall = createCollider({
        x: character.transform.x + 1,
        y: 10,
        solid: true,
      });

      character.collider.enter(wall as ColliderEntity);
      const posAfterFirstCollision = character.transform.x;

      character.collider.enter(wall as ColliderEntity);
      expect(character.transform.x).toBe(posAfterFirstCollision);
    });
  });
});
