import { Pokemon } from '@pkmn/sim';
import { Entity, Scene } from '../../../engine';
import { BoxPreview } from './entities/Preview/BoxPreview.entity';
import { BoxStorage } from './entities/Storage/BoxStorage.entity';

const backgroundAssetUrl = 'sprites/ui/box/bg.png';

export class Box extends Scene {
  private storage: BoxStorage;
  private preview: BoxPreview;

  constructor(pokemon: Pokemon[]) {
    super({
      backgroundAssetUrl,
      loadingFallback: Entity.text('TODO: loading...'),
    });

    this.preview = new BoxPreview();
    this.storage = new BoxStorage(pokemon);

    this.storage.signal.on('hover', (pokemon) => this.onHoverPokemon(pokemon));
  }

  render() {
    return Entity.container(this.preview, this.storage);
  }

  private onHoverPokemon(pokemon: Pokemon | null) {
    if (!pokemon) return this.preview.clear();

    this.preview.update(pokemon);
  }
}
