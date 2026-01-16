import { Pokemon, Dex } from '@pkmn/sim';
import { Container, Entity, IContainer } from '../../../../../../engine';
import { ItemIcon, TypeIcon } from '../../../../../entities';
import { NatureText } from '../../../../../entities/NatureText.entity';
import { toItemId, toTypeId } from '../../../../../util';

const width = 172;
const height = 155;
const sectionHeight = 34;

export class PreviewData extends Entity implements IContainer {
  container = new Container(this);

  constructor(pokemon: Pokemon) {
    super();

    this.transform.set({ width, height });
    this.container.layout.flex({ direction: 'column', gap: 2, gutterY: 5 });

    const [type1, type2] = pokemon.types.map((type) =>
      toTypeId(Dex.types.get(type).id)
    );
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
        new TypeIcon(type1),
        !!type2 && new TypeIcon(type2)
      ),

      Entity.container.center(
        { width, height: sectionHeight },
        Entity.text.lg(ability)
      ),

      Entity.container.center(
        { width, height: sectionHeight, gap: 2 },
        !!item && new ItemIcon(toItemId(item)),
        !!item && Entity.text.lg(item)
      )
    );
  }
}
