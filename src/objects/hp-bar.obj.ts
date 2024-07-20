import { Assets, Spritesheet, Texture } from 'pixi.js';
import { App, ContainerObject, SpriteObject } from '../engine';

const ASSET = 'spritesheets/hp_bar.png';
const SPRITESHEET_HEIGHT = 18;
const w = 96;
const h = 6;

const FRAMES = {
    green: { frame: { x: 0, y: 0, w, h } },
    yellow: { frame: { x: 0, y: h, w, h } },
    red: { frame: { x: 0, y: h * 2, w, h } },
};

export class HpBar extends SpriteObject {
    private static spritesheet: Spritesheet;

    static async loadSpritesheet() {
        if (HpBar.spritesheet) {
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
        HpBar.spritesheet = new Spritesheet(Texture.from(ASSET), atlasData);
        await HpBar.spritesheet.parse();
    }

    setHp(targetPercent: number, animate: boolean, container: ContainerObject) {
        const isIncreasing = targetPercent > this.scale.x;
        const stepMagnitude = Math.abs(this.scale.x - targetPercent) / 10;
        const stepWidth = isIncreasing ? stepMagnitude : -stepMagnitude;
        const min = targetPercent === 0 ? 0 : 0.011;
        App.tick((done) => {
            if (!animate) {
                this.scale.x = targetPercent;
                this.setBarTexture(targetPercent, container);
                return done();
            }
            const nextScale = this.scale.x + stepWidth;
            this.scale.x = isIncreasing
                ? Math.min(1, nextScale)
                : Math.max(min, nextScale);
            this.setBarTexture(this.scale.x, container);
            const isDone = isIncreasing
                ? this.scale.x >= targetPercent
                : this.scale.x <= targetPercent;
            if (isDone) {
                return done();
            }
        });
    }

    private setBarTexture(hpPercent: number, container: ContainerObject) {
        let texture =
            hpPercent > 0.5
                ? HpBar.spritesheet.textures.green
                : hpPercent > 0.25
                ? HpBar.spritesheet.textures.yellow
                : HpBar.spritesheet.textures.red;
        this.setTexture(texture, container);
    }
}