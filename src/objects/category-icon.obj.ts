import { Assets, Spritesheet, Texture } from 'pixi.js';
import { ContainerObject, SpriteObject } from '../engine';
import { toID } from '../../../pokemon-showdown/sim';

const ASSET = 'assets/spritesheets/category.png';
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
        await Assets.load(ASSET);
        const atlasData = {
            frames: FRAMES,
            meta: {
                image: ASSET,
                size: { w, h: SPRITESHEET_HEIGHT },
                scale: 1,
            },
        };
        CategoryIcon.spritesheet = new Spritesheet(
            Texture.from(ASSET),
            atlasData
        );
        await CategoryIcon.spritesheet.parse();
    }

    setCategory(category: string, container: ContainerObject) {
        this.setTexture(
            CategoryIcon.spritesheet.textures[toID(category)],
            container
        );
    }
}
