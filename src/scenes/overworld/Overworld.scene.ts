import { Map } from './entities/Map/Map.entity';

export class Overworld {
  map = new Map({
    dimensions: { w: 50, l: 50 },
    tiles: [
      [
        { type: 'none' },
        { type: 'grass', tile: 'grass', encounters: [] },
        { type: 'grass', tile: 'grass', encounters: [] },
        { type: 'none' },
      ],
      [
        { type: 'none' },
        { type: 'grass', tile: 'grass', encounters: [] },
        { type: 'grass', tile: 'grass', encounters: [] },
        { type: 'none' },
      ],
    ],
  });
}
