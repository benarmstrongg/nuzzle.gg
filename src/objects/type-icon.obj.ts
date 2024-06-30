import { Assets, Spritesheet, Texture } from 'pixi.js';
import { toID } from '../../../pokemon-showdown/sim/dex-data';
import { ContainerObject, SpriteObject } from '../engine';

const ASSET = 'assets/sprites/ui/types/types.png';

const ICON_HEIGHT = 28;

const FRAMES = {
    normal: { frame: { x: 0, y: 0, w: 64, h: 28 } },
    fighting: { frame: { x: 0, y: ICON_HEIGHT, w: 64, h: 28 } },
    flying: { frame: { x: 0, y: ICON_HEIGHT * 2, w: 64, h: 28 } },
    poison: { frame: { x: 0, y: ICON_HEIGHT * 3, w: 64, h: 28 } },
    ground: { frame: { x: 0, y: ICON_HEIGHT * 4, w: 64, h: 28 } },
    rock: { frame: { x: 0, y: ICON_HEIGHT * 5, w: 64, h: 28 } },
    bug: { frame: { x: 0, y: ICON_HEIGHT * 6, w: 64, h: 28 } },
    ghost: { frame: { x: 0, y: ICON_HEIGHT * 7, w: 64, h: 28 } },
    steel: { frame: { x: 0, y: ICON_HEIGHT * 8, w: 64, h: 28 } },
    '???': { frame: { x: 0, y: ICON_HEIGHT * 9, w: 64, h: 28 } },
    fire: { frame: { x: 0, y: ICON_HEIGHT * 10, w: 64, h: 28 } },
    water: { frame: { x: 0, y: ICON_HEIGHT * 11, w: 64, h: 28 } },
    grass: { frame: { x: 0, y: ICON_HEIGHT * 12, w: 64, h: 28 } },
    electric: { frame: { x: 0, y: ICON_HEIGHT * 13, w: 64, h: 28 } },
    psychic: { frame: { x: 0, y: ICON_HEIGHT * 14, w: 64, h: 28 } },
    ice: { frame: { x: 0, y: ICON_HEIGHT * 15, w: 64, h: 28 } },
    dragon: { frame: { x: 0, y: ICON_HEIGHT * 16, w: 64, h: 28 } },
    dark: { frame: { x: 0, y: ICON_HEIGHT * 17, w: 64, h: 28 } },
    fairy: { frame: { x: 0, y: ICON_HEIGHT * 18, w: 64, h: 28 } },
};

export class TypeIcon extends SpriteObject {
    private static spritesheet: Spritesheet;
    static async loadSpritesheet() {
        if (TypeIcon.spritesheet) {
            return;
        }
        await Assets.load(ASSET);
        const atlasData = {
            frames: FRAMES,
            meta: {
                image: ASSET,
                size: { w: 64, h: 532 },
                scale: 1,
            },
        };
        TypeIcon.spritesheet = new Spritesheet(Texture.from(ASSET), atlasData);
        await TypeIcon.spritesheet.parse();
    }

    setType(type: string, container: ContainerObject) {
        this.setTexture(TypeIcon.spritesheet.textures[toID(type)], container);
    }
}
