import { Entity, Scene } from '../../../engine';
// import { Map } from './entities/Map/Map.entity';
import { Player } from './entities/Player.entity';

export class Overworld extends Scene {
  constructor() {
    super({
      // backgroundAssetUrl: 'sprites/ui/overworld/bg.png',
      loadingFallback: Entity.text('TODO: loading...'),
    });
  }

  player = new Player();
  // map = new Map({
  //   dimensions: { w: 50, l: 50 },
  //   tiles: [
  //     [
  //       { type: 'none' },
  //       { type: 'grass', tile: 'grass', encounters: [] },
  //       { type: 'grass', tile: 'grass', encounters: [] },
  //       { type: 'none' },
  //     ],
  //     [
  //       { type: 'none' },
  //       { type: 'grass', tile: 'grass', encounters: [] },
  //       { type: 'grass', tile: 'grass', encounters: [] },
  //       { type: 'none' },
  //     ],
  //   ],
  // });

  render() {
    return this.player.character;
  }
}
