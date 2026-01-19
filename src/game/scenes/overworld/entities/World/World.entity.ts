import { Array2d, Container, Entity, IContainer } from '../../../../../engine';
import { BackgroundTile, BackgroundTileMetadata } from '../BackgroundTile';
import { Tile } from '../Tile';
import { WorldData, WorldTileMetadata } from './types';
import { WorldBorder } from './WorldBorder.entity';

export class World extends Entity implements IContainer {
  container: Container;

  constructor(data: WorldData) {
    super();
    const {
      dimensions: { w: rows, l: columns },
      backgroundTiles,
      tiles,
    } = data;

    this.container = new Container(
      this,
      new WorldBorder(rows, columns),
      this.initBackgroundTileContainer(backgroundTiles, rows, columns),
      this.initWorldTileContainer(tiles, rows, columns)
    );

    // TODO: fix this
    this['ready'] = true;
  }

  private initBackgroundTileContainer(
    backgroundTiles: Array2d<BackgroundTileMetadata>,
    rows: number,
    columns: number
  ) {
    const x = WorldBorder.gutter;
    const y = WorldBorder.gutter;
    const width = BackgroundTile.width * columns;
    const height = BackgroundTile.height * rows;

    return Entity.container.grid(
      { rows, columns, width, height, x, y },
      ...backgroundTiles.flatMap((row) =>
        row.map(({ tile, frame }) => new BackgroundTile(tile, frame))
      )
    );
  }

  private initWorldTileContainer(
    tiles: Array2d<WorldTileMetadata>,
    rows: number,
    columns: number
  ) {
    const x = WorldBorder.gutter;
    const y = WorldBorder.gutter;
    // TODO: is this fine?
    const width = BackgroundTile.width * columns;
    const height = BackgroundTile.height * rows;

    return Entity.container.grid(
      { rows, columns, width, height, x, y },
      ...tiles.flatMap((row) => row.map((metadata) => new Tile(metadata)))
    );
  }
}
