import { Dex, Pokemon } from '@pkmn/sim';
import { Entity, ISprite, Sprite } from '../../engine';
import { PokemonSprite } from './PokemonSprite.entity';

export class PokemonIcon extends Entity implements ISprite {
  static width = 68;
  static height = 56;
  sprite: Sprite;

  constructor(public pokemon: Pokemon) {
    super();

    const assetUrl = PokemonIcon.getIconPath(pokemon);
    const { front } = PokemonSprite.getSpritePaths(pokemon);
    const fallbackAssetUrls = [front, 'sprites/items/unknown.png'];
    this.sprite = new Sprite(this, {
      assetUrl,
      fallbackAssetUrls,
      onLoad: async (assetUrl) => await this.onLoad(assetUrl),
      transform: { width: PokemonIcon.width, height: PokemonIcon.height },
    });
  }

  private async onLoad(assetUrl: string) {
    // Didn't fallback so this is the regular icon, no-op
    if (assetUrl === PokemonIcon.getIconPath(this.pokemon)) {
      return;
    }

    this.transform.scale.set({ x: 1, y: 1 });
    this.transform.width *= 0.5;
    this.transform.height *= 0.5;
    this.sprite.anchor.set({ x: -0.25, y: 0.5 });
  }

  static getIconPath(pokemon: Pokemon) {
    const { num, forme } = Dex.species.get(pokemon.species.name);
    const slug = forme ? `${num}-${forme.toLowerCase()}` : num.toString();
    return `sprites/pokemon/versions/generation-viii/icons/${slug}.png`;
  }
}
