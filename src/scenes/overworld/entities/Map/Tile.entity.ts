import { Entity, ISprite, Sprite } from '../../../../engine';
import { MapTileData } from './types';
import { Item } from './Item.entity';

const w = 10;
const h = 10;
const frames = {
  grass: { x: 0, y: 0, w: 0, h: 0 },
};

export class Tile extends Entity implements ISprite {
  sprite = new Sprite(this, {
    assetUrl: '',
    spritesheet: { frames, w, h },
  });
  item?: Item;

  constructor(data: MapTileData) {
    super();
    switch (data.type) {
      case 'none':
        break;
      case 'grass':
        this.sprite.set(data.type);
        break;
    }
    this.item = data.item && new Item(data.item.item);
  }
}
