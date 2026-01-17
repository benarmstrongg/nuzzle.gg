import { Entity, Container, IContainer } from '../../../../../engine';
import { VoidBackgroundTile } from '../BackgroundTile/VoidBackgroundTile.entity';

const borderExtension = 1;
const borderBottomRightExtension = 2;

export class WorldBorder extends Entity implements IContainer {
  static gutter = VoidBackgroundTile.width;

  container = new Container(this);

  constructor(rows: number, columns: number) {
    super();

    const tileWidth = VoidBackgroundTile.width;
    const tileHeight = VoidBackgroundTile.height;
    const width = tileWidth * columns;
    const height = tileHeight * rows;

    this.transform.set({ width, height });

    const topBorder = Array.from(
      { length: columns + borderExtension },
      (_, col) => new VoidBackgroundTile({ x: col * tileWidth, y: 0 })
    );
    const bottomBorder = Array.from(
      { length: columns + borderExtension },
      (_, col) =>
        new VoidBackgroundTile({ x: col * tileWidth, y: height + tileHeight })
    );
    const leftBorder = Array.from(
      { length: rows + borderExtension },
      (_, row) => new VoidBackgroundTile({ x: 0, y: row * tileHeight })
    );
    const rightBorder = Array.from(
      { length: rows + borderBottomRightExtension },
      (_, row) =>
        new VoidBackgroundTile({ x: width + tileWidth, y: row * tileHeight })
    );

    this.container.add(
      ...topBorder,
      ...bottomBorder,
      ...leftBorder,
      ...rightBorder
    );
  }
}
