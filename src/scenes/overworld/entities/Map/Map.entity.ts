import { Container, Entity, IContainer } from '../../../../engine';
import { Tile } from './Tile.entity';
import { MapData } from './types';

export class Map extends Entity implements IContainer {
  container = new Container(this);

  constructor(data: MapData) {
    super();
    const { dimensions, tiles } = data;
    this.container.layout.grid({
      rows: dimensions.w,
      columns: dimensions.l,
    });
    tiles.forEach((row) =>
      this.container.add(...row.map((row) => new Tile(row)))
    );
  }
}
