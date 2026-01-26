import {
  Collider,
  ColliderEntity,
  Entity,
  ICollider,
  ISprite,
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

const stepSize = 20;
const walkDuration = 20;

export class Character extends Entity implements ISprite, ICollider {
  static height = characterHeight;
  static width = characterWidth;

  sprite: Sprite<CharacterFrame, CharacterAnimation>;
  orientation: CharacterDirection;
  collider = new Collider(this, {
    onEnter: (entity) => this.onCollide(entity),
  });

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

  walk(direction: CharacterDirection) {
    console.count('walk');
    this.orientation = direction;
    this.sprite.animation.play(`walk_${direction}`);

    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
    const magnitude = direction === 'up' || direction === 'left' ? -1 : 1;

    return this.transform.moveBy(
      { [axis]: stepSize * magnitude },
      walkDuration
    );
  }

  stop() {
    console.count('stop');
    this.sprite.animation.stop();
    // this.sprite.animation.play(`idle_${this.orientation}`);
  }

  private onCollide(entity: ColliderEntity) {
    if (entity.collider.solid) {
      const axis =
        this.orientation === 'up' || this.orientation === 'down' ? 'y' : 'x';
      const direction =
        this.orientation === 'up' || this.orientation === 'left' ? -1 : 1;

      this.transform[axis] -= direction;
    }
  }
}
