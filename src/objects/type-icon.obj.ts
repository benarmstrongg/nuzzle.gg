import { Spritesheet } from 'pixi.js';
import { toID } from '../../../pokemon-showdown/sim/dex-data';
import { ContainerObject, SpriteObject } from '../engine';
import { loadSpritesheet } from '../util/assets.util';

const ASSET = 'spritesheets/type.png';
const SPRITESHEET_HEIGHT = 532;
const w = 64;
const h = 28;

const FRAMES = {
    normal: { frame: { x: 0, y: 0, w, h } },
    fighting: { frame: { x: 0, y: h, w, h } },
    flying: { frame: { x: 0, y: h * 2, w, h } },
    poison: { frame: { x: 0, y: h * 3, w, h } },
    ground: { frame: { x: 0, y: h * 4, w, h } },
    rock: { frame: { x: 0, y: h * 5, w, h } },
    bug: { frame: { x: 0, y: h * 6, w, h } },
    ghost: { frame: { x: 0, y: h * 7, w, h } },
    steel: { frame: { x: 0, y: h * 8, w, h } },
    '???': { frame: { x: 0, y: h * 9, w, h } },
    fire: { frame: { x: 0, y: h * 10, w, h } },
    water: { frame: { x: 0, y: h * 11, w, h } },
    grass: { frame: { x: 0, y: h * 12, w, h } },
    electric: { frame: { x: 0, y: h * 13, w, h } },
    psychic: { frame: { x: 0, y: h * 14, w, h } },
    ice: { frame: { x: 0, y: h * 15, w, h } },
    dragon: { frame: { x: 0, y: h * 16, w, h } },
    dark: { frame: { x: 0, y: h * 17, w, h } },
    fairy: { frame: { x: 0, y: h * 18, w, h } },
};

export class TypeIcon extends SpriteObject {
    private static spritesheet: Spritesheet;
    static width = w;
    static height = h;

    static async loadSpritesheet() {
        if (TypeIcon.spritesheet) {
            return;
        }
        TypeIcon.spritesheet = await loadSpritesheet(
            ASSET,
            FRAMES,
            w,
            SPRITESHEET_HEIGHT
        );
    }

    setType(type: string, container: ContainerObject) {
        this.setTexture(TypeIcon.spritesheet.textures[toID(type)], container);
    }
}
