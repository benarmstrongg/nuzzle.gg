import { Pokemon } from 'pokemon-showdown/sim';
import { Container, Entity, IContainer } from '../../../../../../engine';
import { PokemonSprite } from '../../../../../entities';

const width = 178;
const height = 176;
const y = 65;

export class PreviewPokemon extends Entity implements IContainer {
  container = new Container(this);

  constructor(pokemon: Pokemon) {
    super();
    this.transform.set({ width, height, y });
    this.container.layout.flex({ justify: 'center', align: 'center' });
    const pokemonSprite = new PokemonSprite(pokemon);

    // pokemonSprite.onReady(() => {
    pokemonSprite.transform.scale.set({ x: 1.5, y: 1.5 });
    this.container.add(pokemonSprite);
    // });
  }
}
