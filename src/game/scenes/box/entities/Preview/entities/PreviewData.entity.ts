import { Dex, Pokemon } from 'pokemon-showdown/sim';
import { toID } from 'pokemon-showdown/sim/dex-data';
import { Container, Entity, IContainer } from '../../../../../../engine';
import { ItemIcon, TypeIcon } from '../../../../../entities';
import { NatureText } from '../../../../../entities/NatureText.entity';

const width = 172;
const height = 155;
const sectionHeight = 34;

export class PreviewData extends Entity implements IContainer {
  container = new Container(this);

  constructor(pokemon: Pokemon) {
    super();

    this.transform.set({ width, height });
    this.container.layout.flex({ direction: 'column', gap: 2, gutterY: 5 });

    const [type1, type2] = pokemon.types;
    const { name: ability } = Dex.abilities.get(pokemon.ability);
    const { name: item } = Dex.items.get(pokemon.set.item);

    this.container.add(
      Entity.container.flex(
        {
          justify: 'center',
          align: 'center',
          width,
          height: sectionHeight,
        },
        new NatureText(pokemon, { width, height: sectionHeight })
      ),

      Entity.container.flex(
        {
          justify: 'center',
          align: 'center',
          gap: 5,
          width,
          height: sectionHeight,
        },
        new TypeIcon(toID(type1)),
        !!type2 && new TypeIcon(toID(type2))
      ),

      Entity.container.center(
        { width, height: sectionHeight },
        Entity.text.lg(ability)
      ),

      Entity.container.center(
        { width, height: sectionHeight, gap: 2 },
        !!item && new ItemIcon(toID(item)),
        !!item && Entity.text.lg(item)
      )
    );
  }
}
