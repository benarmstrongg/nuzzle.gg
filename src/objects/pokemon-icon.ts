import { Assets, Container, Texture, TextureSource } from 'pixi.js';
import { GameObject } from '../engine/game-object';
import { getPokemonAssetPath } from '../util/assets.util';

export class PokemonIcon extends GameObject {
    async setPokemon(pokemon: string, container?: Container) {
        let asset: TextureSource;
        try {
            asset = await Assets.load(getPokemonAssetPath(pokemon, 'icon'));
        } catch {
            try {
                asset = await Assets.load(
                    getPokemonAssetPath(pokemon, 'front')
                );
                this.scale = 0.5;
                this.anchor = -0.25;
            } catch {
                asset = await Assets.load(
                    'assets/sprites/pokemon/201-question.png'
                );
            }
        }
        this.setTexture(new Texture(asset), container);
    }
}
