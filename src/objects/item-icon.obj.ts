import { Assets, Texture, TextureSource } from 'pixi.js';
import { SpriteObject, ContainerObject } from '../engine';
import { toID } from '../../../pokemon-showdown/sim/dex-data';

export class ItemIcon extends SpriteObject {
    async setItem(item: string, container: ContainerObject) {
        const id = toID(item);
        const url = `sprites/items/${id}.png`;
        let asset: TextureSource;
        try {
            asset = await Assets.load(url);
        } catch {
            asset = await Assets.load('sprites/items/xspatk.png');
        }
        this.setTexture(new Texture(asset), container);
    }
}
