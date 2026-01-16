import {
  Collisions,
  Container,
  Entity,
  ICollisions,
  IContainer,
} from '../../../../../engine';
import { BackgroundTile } from '../BackgroundTile/BackgroundTile';
import { Tile } from '../Tile';
import { WorldData } from './types';

export class World extends Entity implements IContainer, ICollisions {
  container: Container;
  collisions: Collisions;

  constructor(data: WorldData) {
    super();
    const {
      dimensions: { w: rows, l: columns },
      backgroundTiles,
      tiles,
    } = data;

    const width = BackgroundTile.width * columns;
    const height = BackgroundTile.height * rows;

    this.container = new Container(
      this,
      Entity.container.grid(
        { rows, columns, width, height },
        ...backgroundTiles.flatMap((row) =>
          row.map(({ tile, frame }) => new BackgroundTile(tile, frame))
        )
      ),
      Entity.container.grid(
        { rows, columns, width, height },
        ...tiles.flatMap((row) => row.map((metadata) => new Tile(metadata)))
      )
    );

    this.collisions = new Collisions(this);

    // TODO: fix this
    this['ready'] = true;
  }
}
