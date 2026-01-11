import { Entity, ISprite, Sprite } from '../../engine';
import { getPokemonIconPath, getPokemonSpritePaths } from '../util/assets.util';
import { Pokemon } from 'pokemon-showdown/sim';

export class PokemonIcon extends Entity implements ISprite {
  static width = 68;
  static height = 56;
  sprite: Sprite;

  constructor(public pokemon: Pokemon) {
    super();

    const assetUrl = getPokemonIconPath(pokemon);
    const { front } = getPokemonSpritePaths(pokemon);
    const fallbackAssetUrls = [front, 'sprites/items/unknown.png'];
    this.sprite = new Sprite(this, {
      assetUrl,
      fallbackAssetUrls,
      onLoad: this.onLoad,
    });
  }

  private onLoad = (assetUrl: string) => {
    if (assetUrl === getPokemonIconPath(this.pokemon)) {
      return;
    }

    this.transform.scale.set({ x: 1, y: 1 });
    this.transform.width *= 0.5;
    this.transform.height *= 0.5;
    this.sprite.state.set({ anchor: { x: -0.25, y: -0.25 } });
  };
}
