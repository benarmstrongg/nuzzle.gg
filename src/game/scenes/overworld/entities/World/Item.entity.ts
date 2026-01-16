import { Entity, ISprite, Sprite } from '../../../../../engine';
import { ItemId } from '../../../../types';

export class Item extends Entity implements ISprite {
  sprite = new Sprite(this, { assetUrl: '' });

  constructor(item: ItemId) {
    super();
    this.sprite.set(item);
  }
}
