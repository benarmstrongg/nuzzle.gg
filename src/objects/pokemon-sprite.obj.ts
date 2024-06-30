import { Assets, Texture } from 'pixi.js';
import { ContainerObject, SpriteObject } from '../engine';
import { getPokemonAssetPath } from '../util/assets.util';

export class PokemonSprite extends SpriteObject {
    async setPokemon(pokemon: string, container: ContainerObject) {
        const source = await Assets.load(getPokemonAssetPath(pokemon, 'front'));
        this.setTexture(new Texture(source), container);
    }
}
