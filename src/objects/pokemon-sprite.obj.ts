import { Assets, Container, Texture } from 'pixi.js';
import { SpriteObject } from '../engine';
import { getPokemonAssetPath } from '../util/assets.util';

export class PokemonSprite extends SpriteObject {
    async setPokemon(pokemon: string, container: Container) {
        const source = await Assets.load(getPokemonAssetPath(pokemon, 'front'));
        this.setTexture(new Texture(source), container);
    }
}
