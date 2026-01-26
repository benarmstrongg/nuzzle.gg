import {
  Container,
  Controls,
  Entity,
  IContainer,
  IControls,
} from '../../../../engine';
import { Character } from '../../../entities';

export class Player extends Entity implements IControls, IContainer {
  container: Container;
  controls = Controls.selected();

  character = new Character('red');

  constructor() {
    super();

    this.container = new Container(this, this.character);

    this.transform.set(this.character.transform);

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
