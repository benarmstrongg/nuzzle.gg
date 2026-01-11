import { Pokemon } from 'pokemon-showdown/sim';
import {
  Controls,
  Entity,
  IControls,
  ISignal,
  ISprite,
  IState,
  Signal,
  Sprite,
  State,
} from '../../../../../../engine';

type StorageCursorState = {
  position: { row: number; col: number };
  pokemon: Pokemon | null;
};

export type StorageCursorMoveEvent = {
  direction: 'x' | 'y';
  magnitude: 1 | -1;
};

type StorageCursorSignal = {
  move: StorageCursorMoveEvent;
  select: Pokemon | null;
};

export class StorageCursor
  extends Entity
  implements ISprite, IState, IControls, ISignal
{
  sprite = new Sprite(this, { assetUrl: 'sprites/ui/box/cursor_grab.png' });
  state = new State<StorageCursorState>({
    position: { row: 1, col: 1 },
    pokemon: null,
  });
  controls = Controls.selected();
  signal = new Signal<StorageCursorSignal>();

  constructor() {
    super();

    this.controls.on('up', () => {
      this.signal.emit('move', { direction: 'y', magnitude: -1 });
    });
    this.controls.on('down', () =>
      this.signal.emit('move', { direction: 'y', magnitude: 1 })
    );
    this.controls.on('left', () =>
      this.signal.emit('move', { direction: 'x', magnitude: -1 })
    );
    this.controls.on('right', () =>
      this.signal.emit('move', { direction: 'x', magnitude: 1 })
    );
    this.controls.on('a', () => {
      if (!this.state.pokemon) return;

      this.signal.emit('select', this.state.pokemon);
    });
  }
}
