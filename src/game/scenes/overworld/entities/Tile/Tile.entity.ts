import { Entity, ISprite, Sprite } from '../../../../../engine';
import { WorldTileMetadata } from '../World/types';
import { Item } from '../World/Item.entity';
import { toItemId } from '../../../../util';

const w = 10;
const h = 10;
const frames = {
  grass: { x: 0, y: 0, w: 0, h: 0 },
};

export class Tile extends Entity implements ISprite {
  sprite = new Sprite(this, {
    assetUrl: '',
    spritesheet: { frames, w, h, defaultFrame: 'grass' },
  });
  item?: Item;

  constructor(data: WorldTileMetadata) {
    super();
    switch (data.type) {
      case 'none':
        break;
      case 'grass':
        this.sprite.set(data.type);
        break;
    }
    this.item = data.item && new Item(toItemId(data.item.item));
  }
}
