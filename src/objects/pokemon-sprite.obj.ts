import { Assets, SpriteOptions, Texture, TextureSource } from 'pixi.js';
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

    async setPokemon(species: string, container: ContainerObject) {
        const source = await this.loadTexture(species);
        this.setTexture(new Texture(source), container);
    }

    private async loadTexture(species: string): Promise<TextureSource> {
        this.scale.x = Math.abs(this.scale.x);
        this.anchor.x = 0;
        if (this.type === 'back') {
            let source: TextureSource;
            try {
                source = (await Assets.load(
                    getPokemonSpritePath(species, 'back')
                )) as TextureSource;
            } catch {
                source = await Assets.load(
                    getPokemonSpritePath(species, 'front')
                );
                this.scale.x = -1 * Math.abs(this.scale.x);
                this.anchor.x = 1;
            }
            return source;
        }
        return Assets.load(getPokemonSpritePath(species, this.type));
    }
}
