import { Assets, Container, Texture, TextureSource } from 'pixi.js';
import { SpriteObject } from '../engine';
import { toID } from '../../../pokemon-showdown/sim/dex-data';

export class ItemIcon extends SpriteObject {
    async setItem(item: string, container: Container) {
        const id = toID(item);
        let url: string;
        if (id.includes('berry')) {
            url = `assets/sprites/items/berries/${id}.png`;
            this.scale = 0.5;
        } else {
            url = `assets/sprites/items/${id}.png`;
            this.scale = 0.8;
        }
        let asset: TextureSource;
        try {
            asset = await Assets.load(url);
        } catch {
            asset = await Assets.load('assets/sprites/items/xspatk.png');
        }
        this.label = 'hello';
        this.setTexture(new Texture(asset), container);
    }
}
