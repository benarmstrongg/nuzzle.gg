import { Assets, Container, Texture, TextureSource } from 'pixi.js';
import { GameObject } from '../engine/game-object';
import { toID } from '../../../pokemon-showdown/sim/dex-data';

export class ItemIcon extends GameObject {
    async setItem(item: string, container?: Container) {
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
