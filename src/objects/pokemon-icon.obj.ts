import { Assets, Texture, TextureSource } from 'pixi.js';
import { ContainerObject, SpriteObject } from '../engine';
import { getPokemonSpritePath } from '../util/assets.util';

export class PokemonIcon extends SpriteObject {
    async setPokemon(pokemon: string, container: ContainerObject) {
        let asset: TextureSource;
        try {
            asset = await Assets.load(getPokemonSpritePath(pokemon, 'icon'));
        } catch {
            try {
                asset = await Assets.load(
                    getPokemonSpritePath(pokemon, 'front')
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
