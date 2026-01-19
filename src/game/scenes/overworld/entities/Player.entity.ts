import {
  Collider,
  Controls,
  Entity,
  ICollider,
  IControls,
} from '../../../../engine';
import { Character } from '../../../entities';

export class Player extends Entity implements IControls, ICollider {
  character = new Character('red');
  controls = Controls.selected();
  collider = new Collider(this);

  constructor() {
    super();

    this.controls.hold(
      'up',
      () => this.character.walk('up'),
      () => this.character.stop()
    );
    this.controls.hold(
      'down',
      () => this.character.walk('down'),
      () => this.character.stop()
    );
    this.controls.hold(
      'left',
      () => this.character.walk('left'),
      () => this.character.stop()
    );
    this.controls.hold(
      'right',
      () => this.character.walk('right'),
      () => this.character.stop()
    );
  }
}
