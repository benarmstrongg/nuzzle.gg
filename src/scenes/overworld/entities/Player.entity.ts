import { Entity, ISprite, Sprite } from '../../../engine';

export class Player extends Entity implements ISprite {
  sprite = new Sprite(this, { assetUrl: '' });

  constructor() {
    super();
  }
}
