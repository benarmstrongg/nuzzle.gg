import { Dex, Pokemon } from '../../../pokemon-showdown/sim';
import { Container, Entity, IContainer, TransformState } from '../engine';

export class NatureText extends Entity implements IContainer {
  container = new Container(this);

  constructor(pokemon: Pokemon, transform?: Partial<TransformState>) {
    super();

    const nature = Dex.natures.get(pokemon.set.nature);
    const { name, plus, minus } = Dex.natures.get(nature);

    const { width, height, x, y } = transform ?? {};
    this.transform.set({ width, height, x, y });
    this.container.layout.flex({
      justify: 'center',
      align: 'end',
      gap: 6,
      gutterY: 5,
    });

    this.container.add(
      Entity.text.lg(name),
      (plus || minus) &&
        Entity.container.flex(
          { gap: 2 },
          plus && Entity.text.sm(`+${plus}`, { color: 'red' }),
          minus && Entity.text.sm(`-${minus}`, { color: 'blue' })
        )
    );
  }
}
