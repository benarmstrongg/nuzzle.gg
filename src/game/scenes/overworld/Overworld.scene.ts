import { Array2d, Entity, Scene } from '../../../engine';
import { World } from './entities/World/World.entity';
import { Player } from './entities/Player.entity';
import { BackgroundTileMetadata } from './entities/BackgroundTile/types';

const tmpBackgroundTiles: Array2d<BackgroundTileMetadata> = [
  [
    { tile: 'light_grass', frame: 'top_left' },
    ...Array.from(
      { length: 18 },
      () =>
        ({
          tile: 'light_grass',
          frame: 'top_center',
        } as BackgroundTileMetadata)
    ),
    { tile: 'light_grass', frame: 'top_right' },
  ],
  ...Array.from(
    { length: 18 },
    () =>
      [
        { tile: 'light_grass', frame: 'center_left' },
        ...Array.from(
          { length: 18 },
          () =>
            ({
              tile: 'light_grass',
              frame: 'center_center',
            } as BackgroundTileMetadata)
        ),
        { tile: 'light_grass', frame: 'center_right' },
      ] as BackgroundTileMetadata[]
  ),
  [
    { tile: 'light_grass', frame: 'bottom_left' },
    ...Array.from(
      { length: 18 },
      () =>
        ({
          tile: 'light_grass',
          frame: 'bottom_center',
        } as BackgroundTileMetadata)
    ),
    { tile: 'light_grass', frame: 'bottom_right' },
  ],
];

export class Overworld extends Scene {
  player = new Player();
  world = new World({
    dimensions: { w: 20, l: 20 },
    tiles: [],
    backgroundTiles: tmpBackgroundTiles,
  });

  constructor() {
    super({
      // backgroundAssetUrl: 'sprites/ui/overworld/bg.png',
      loadingFallback: Entity.text('TODO: loading...'),
    });
  }

  render() {
    return Entity.container(this.world, this.player.character);
  }
}
