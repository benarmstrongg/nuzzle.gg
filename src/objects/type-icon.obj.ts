import { Assets, Container, Texture } from 'pixi.js';
import { SpriteObject } from '../engine';

const ICON_MAP: Record<string, number> = {
    normal: 1,
    fighting: 2,
    flying: 3,
    poison: 4,
    ground: 5,
    rock: 6,
    bug: 7,
    ghost: 8,
    steel: 9,
    fire: 10,
    water: 11,
    grass: 12,
    electric: 13,
    psychic: 14,
    ice: 15,
    dragon: 16,
    dark: 17,
    fairy: 18,
};

export class TypeIcon extends SpriteObject {
    async setType(type: string, container: Container) {
        const asset = await Assets.load(
            `assets/sprites/types/generation-viii/brilliant-diamond-and-shining-pearl/${
                ICON_MAP[type.toLowerCase()]
            }.png`
        );
        this.setTexture(new Texture(asset), container);
    }
}
