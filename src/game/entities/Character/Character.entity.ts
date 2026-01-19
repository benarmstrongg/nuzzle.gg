import { Entity, ISprite, Sprite } from '../../../engine';
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
  animations,
} from './spritesheet.const';

const stepSize = 20;
const walkDuration = 40;

export class Character extends Entity implements ISprite {
  sprite: Sprite<CharacterFrame, CharacterAnimation>;
  orientation: CharacterDirection;

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

    this.onReady(() => {
      this.sprite.animation.play('idle_down');
    });
  }

  walk(direction: CharacterDirection) {
    this.orientation = direction;
    this.sprite.animation.play(`walk_${direction}`);

    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
    const magnitude = direction === 'up' || direction === 'left' ? -1 : 1;

    this.transform.moveBy({ [axis]: stepSize * magnitude }, walkDuration);
  }

  stop() {
    this.sprite.animation.stop();
    // this.sprite.animation.play(`idle_${this.orientation}`);
  }
}
