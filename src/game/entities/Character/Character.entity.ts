import {
  Collider,
  ColliderEntity,
  Entity,
  ICollider,
  Sprite,
} from '../../../engine';
import {
  CharacterFrame,
  CharacterId,
  CharacterDirection,
  CharacterAnimation,
} from './types';
import {
  assetUrls,
  frames,
  defaultFrame,
  w,
  h,
  characterWidth,
  characterHeight,
  animations,
} from './spritesheet.const';

export class Character extends Entity.Sprite implements ICollider {
  static stepSize = 20;
  static walkDuration = 15;
  static height = characterHeight;
  static width = characterWidth;

  sprite: Sprite<CharacterFrame, CharacterAnimation>;
  orientation: CharacterDirection;
  collider = new Collider(this, {
    onEnter: (entity) => this.onCollide(entity),
  });
  private walking = false;

  constructor(character: CharacterId) {
    super();

    const assetUrl = assetUrls[character];
    if (!assetUrl) {
      throw new Error(`Character ${character} not found`);
    }
    this.sprite = new Sprite(this, {
      assetUrl,
      spritesheet: { frames, w, h, animations, defaultFrame },
    });

    this.transform.set({ width: characterWidth, height: characterHeight });

    this.onReady(() => {
      this.sprite.animation.play('idle_down');
    });
  }

  async walk(direction: CharacterDirection) {
    if (this.walking) return;
    this.walking = true;

    this.orientation = direction;
    this.sprite.animation.play(`walk_${direction}`);

    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
    const magnitude = direction === 'up' || direction === 'left' ? -1 : 1;

    await this.transform.moveBy(
      { [axis]: Character.stepSize * magnitude },
      Character.walkDuration
    );
    this.walking = false;
  }

  stop() {
    this.sprite.animation.stop();
    this.walking = false;
    this.transform.stop();
    // this.sprite.animation.play(`idle_${this.orientation}`);
  }

  isFacing(entity: ColliderEntity) {
    const isVertical = this.orientation === 'up' || this.orientation === 'down';
    const direction =
      this.orientation === 'up' || this.orientation === 'left' ? -1 : 1;

    const myPos = isVertical ? this.transform.globalY : this.transform.globalX;
    const theirPos = isVertical
      ? entity.transform.globalY
      : entity.transform.globalX;

    return direction > 0 ? theirPos >= myPos : theirPos <= myPos;
  }

  private onCollide(entity: ColliderEntity) {
    if (this.collider.isCollidingWith(entity)) return;

    if (entity.collider.solid && this.isFacing(entity)) {
      const axis =
        this.orientation === 'up' || this.orientation === 'down' ? 'y' : 'x';
      const direction =
        this.orientation === 'up' || this.orientation === 'left' ? -1 : 1;

      this.transform.stop();
      this.transform[axis] -= direction;
    }
  }
}
