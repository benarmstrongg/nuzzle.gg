import { Entity, ISprite, Sprite } from '../engine';
import { ItemId } from '../types';

const fallbackAssetUrls = ['sprites/items/xspatk.png'];

export class ItemIcon extends Entity implements ISprite {
  sprite: Sprite;

  constructor(itemId: ItemId) {
    super();
    this.setSprite(itemId);
  }

  private setSprite(item: ItemId) {
    const assetUrl = `sprites/items/${item}.png`;
    this.sprite = new Sprite(this, { assetUrl, fallbackAssetUrls });
  }
}
