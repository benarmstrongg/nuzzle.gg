import { Spritesheet } from 'pixi.js';
import { ContainerObject, SpriteObject } from '../engine';
import { toID } from '../../../pokemon-showdown/sim';
import { loadSpritesheet } from '../util/assets.util';

const ASSET = 'spritesheets/status.png';
const SPRITESHEET_HEIGHT = 96;
const w = 44;
const h = 16;

const FRAMES = {
    slp: { frame: { x: 0, y: 0, w, h } },
    psn: { frame: { x: 0, y: h, w, h } },
    brn: { frame: { x: 0, y: h * 2, w, h } },
    par: { frame: { x: 0, y: h * 3, w, h } },
    frz: { frame: { x: 0, y: h * 4, w, h } },
    tox: { frame: { x: 0, y: h * 5, w, h } },
};

export class StatusIcon extends SpriteObject {
    private static spritesheet: Spritesheet;
    static width = w;
    static height = h;

    static async loadSpritesheet() {
        if (StatusIcon.spritesheet) {
            return;
        }
        StatusIcon.spritesheet = await loadSpritesheet(
            ASSET,
            FRAMES,
            w,
            SPRITESHEET_HEIGHT
        );
    }

    setStatus(status: string, container: ContainerObject) {
        this.setTexture(
            StatusIcon.spritesheet.textures[toID(status)],
            container
        );
    }
}
