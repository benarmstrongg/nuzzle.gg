import { Dex, Pokemon } from 'pokemon-showdown/sim';
import { Container, Entity, IContainer } from '../../../../../engine';

const width = 178;
const height = 40;

export class PreviewHeader extends Entity implements IContainer {
  container = new Container(this);

  constructor(pokemon: Pokemon) {
    super();
    this.transform.set({ width, height });
    this.container.layout.flex({
      justify: 'space-between',
      align: 'end',
      gutterX: 5,
      gutterY: 2,
    });

    const speciesData = Dex.species.get(pokemon.name);
    this.container.add(
      Entity.text.xxl(speciesData.baseSpecies),
      Entity.text.md(`lvl ${pokemon.level}`)
    );
  }
}
