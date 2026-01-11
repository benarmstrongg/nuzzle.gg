import { Entity, Scene } from '../../../engine';
import { Map } from './entities/Map/Map.entity';

export class Overworld extends Scene {
  constructor() {
    super({
      backgroundAssetUrl: 'sprites/ui/overworld/bg.png',
      loadingFallback: Entity.text('TODO: loading...'),
    });
  }

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

  render() {
    return this.map;
  }
}
