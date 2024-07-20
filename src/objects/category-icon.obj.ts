import { Spritesheet } from 'pixi.js';
import { ContainerObject, SpriteObject } from '../engine';
import { toID } from '../../../pokemon-showdown/sim';
import { loadSpritesheet } from '../util/assets.util';

const ASSET = 'spritesheets/category.png';
const SPRITESHEET_HEIGHT = 532;
const w = 64;
const h = 28;

const FRAMES = {
    physical: { frame: { x: 0, y: 0, w, h } },
    special: { frame: { x: 0, y: h, w, h } },
    status: { frame: { x: 0, y: h * 2, w, h } },
};

export class CategoryIcon extends SpriteObject {
    private static spritesheet: Spritesheet;
    static width = w;
    static height = h;

    static async loadSpritesheet() {
        if (CategoryIcon.spritesheet) {
            return;
        }
        CategoryIcon.spritesheet = await loadSpritesheet(
            ASSET,
            FRAMES,
            w,
            SPRITESHEET_HEIGHT
        );
    }

    setCategory(category: string, container: ContainerObject) {
        this.setTexture(
            CategoryIcon.spritesheet.textures[toID(category)],
            container
        );
    }
}
