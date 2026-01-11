import { Pokemon } from '../../../../../../pokemon-showdown/sim';
import { Container, Entity, IContainer } from '../../../../engine';
import { PreviewData, PreviewHeader, PreviewPokemon } from './entities';

const width = 178;
const height = 382;

export class BoxPreview extends Entity implements IContainer {
  container = new Container(this);
  private bg = Entity.sprite({ assetUrl: 'sprites/ui/box/overlay_main.png' });

  constructor() {
    super();

    this.transform.set({ width, height });
    this.container.add(this.bg);
  }

  clear() {
    this.container.clear();
    this.container.add(this.bg);
  }

  update(pokemon: Pokemon) {
    this.clear();

    // this.container.add(
    //   new PreviewName(pokemon),
    //   new PreviewLevel(pokemon),
    //   // new PreviewTypes(pokemon),
    //   new PreviewAbility(pokemon),
    //   new NatureText(pokemon),
    //   new PokemonSprite(pokemon),
    //   new PreviewItem(pokemon)
    //   // new PreviewMoves(pokemon)
    // );

    this.container.add(
      Entity.container.flex(
        { direction: 'column', gap: 5 },
        new PreviewHeader(pokemon),
        new PreviewPokemon(pokemon),
        new PreviewData(pokemon)
      )
    );
  }
}
