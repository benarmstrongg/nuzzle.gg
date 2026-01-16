import { Dex, Pokemon } from '@pkmn/sim';
import { Container, Entity, IContainer, TransformState } from '../../engine';

export class NatureText extends Entity implements IContainer {
  container = new Container(this);

  constructor(pokemon: Pokemon, transform?: Partial<TransformState>) {
    super();

    const { name, plus, minus } = Dex.natures.get(pokemon.set.nature);

    const { width, height, x, y } = transform ?? {};
    this.transform.set({ width, height, x, y });
    this.container.layout.flex({
      justify: 'center',
      align: 'end',
      gap: 6,
      gutterY: 5,
    });

    this.container.add(
      Entity.text.lg(name || 'Serious'),
      (plus || minus) &&
        Entity.container.flex(
          { gap: 2 },
          plus && Entity.text.sm(`+${plus}`, { color: 'red' }),
          minus && Entity.text.sm(`-${minus}`, { color: 'blue' })
        )
    );
  }
}
