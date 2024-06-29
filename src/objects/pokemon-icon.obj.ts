import { Assets, Container, Texture, TextureSource } from 'pixi.js';
import { SpriteObject } from '../engine';
import { getPokemonAssetPath } from '../util/assets.util';

export class PokemonIcon extends SpriteObject {
    async setPokemon(pokemon: string, container: Container) {
        let asset: TextureSource;
        try {
            asset = await Assets.load(getPokemonAssetPath(pokemon, 'icon'));
        } catch {
            try {
                asset = await Assets.load(
                    getPokemonAssetPath(pokemon, 'front')
                );
            } catch {
                asset = await Assets.load(
                    'assets/sprites/pokemon/201-question.png'
                );
            }
            this.scale = 0.5;
            this.anchor = -0.25;
        }
        this.setTexture(new Texture(asset), container);
    }
}
