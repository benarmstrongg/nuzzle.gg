import { Assets, SpriteOptions, Texture } from 'pixi.js';
import { ContainerObject, SpriteObject } from '../engine';
import { getPokemonSpritePath } from '../util/assets.util';

type PokemonSpriteOptions = SpriteOptions & {
    type?: 'front' | 'back';
};

export class PokemonSprite extends SpriteObject {
    private readonly type: 'front' | 'back';

    constructor(opts: PokemonSpriteOptions) {
        super(opts);
        this.type = opts.type || 'front';
    }

    async setPokemon(pokemon: string, container: ContainerObject) {
        const source = await Assets.load(
            getPokemonSpritePath(pokemon, this.type)
        );
        this.setTexture(new Texture(source), container);
    }
}
