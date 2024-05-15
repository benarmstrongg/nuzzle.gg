import { Assets, Container, Texture } from 'pixi.js';
import { GameObject } from '../engine/game-object';
import { getPokemonAssetPath } from '../util/assets.util';

export class PokemonSprite extends GameObject {
    async setPokemon(pokemon: string, container?: Container) {
        const source = await Assets.load(getPokemonAssetPath(pokemon, 'front'));
        this.setTexture(new Texture(source), container);
    }
}
