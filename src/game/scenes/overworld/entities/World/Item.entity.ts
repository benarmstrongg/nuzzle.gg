import { Entity, Sprite } from 'nuzzlengine';
import { ItemId } from 'nuzzle.gg/types';

export class Item extends Entity.Sprite {
  sprite = new Sprite(this, { assetUrl: '' });

  constructor(item: ItemId) {
    super();
    this.sprite.set(item);
  }
}
