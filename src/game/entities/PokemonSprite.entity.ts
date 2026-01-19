import { Dex, Pokemon } from '@pkmn/sim';
import { Entity, ISprite, Sprite } from '../../engine';

// const transform = { width: 150, height: 150 };
const anchor = { x: 0.5, y: 0.5 };

export class PokemonSprite extends Entity implements ISprite {
  sprite: Sprite;

  constructor(pokemon: Pokemon, type: 'front' | 'back' = 'front') {
    super();

    const { front, back } = PokemonSprite.getSpritePaths(pokemon);
    const assetUrl = type === 'front' ? front : back;
    const fallbackAssetUrls = [
      type === 'front' ? back : front,
      'sprites/items/unknown.png',
    ];
    this.sprite = new Sprite(this, {
      assetUrl,
      fallbackAssetUrls,
      anchor,
      // transform,
    });
  }

  static getSpritePaths(pokemon: Pokemon) {
    const { num, forme } = Dex.species.get(pokemon.species.name);
    const slug = forme ? `${num}-${forme.toLowerCase()}` : num.toString();

    return {
      front: `sprites/pokemon/${slug}.png`,
      back: `sprites/pokemon/back/${slug}.png`,
    };
  }

  // TODO: old logic for gen9 mons missing backsprites
  // what is scale and anchor doing? probably those images are too large and weirdly positioned when scaled.
  // is this necessary anymore? check pokemon sprites repo for updated gen9 sprites
  //   private async loadTexture(species: string): Promise<TextureSource> {
  //     this.scale.x = Math.abs(this.scale.x);
  //     if (this.type === 'back') {
  //       let source: TextureSource;
  //       try {
  //         source = (await Assets.load(
  //           getPokemonSpritePath(species, 'back')
  //         )) as TextureSource;
  //       } catch {
  //         source = await Assets.load(getPokemonSpritePath(species, 'front'));
  //         this.scale.x = -1 * Math.abs(this.scale.x);
  //         this.anchor.x = 1;
  //       }
  //       return source;
  //     }
  //     return Assets.load(getPokemonSpritePath(species, this.type));
  //   }
}
