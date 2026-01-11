import { Dex, Pokemon, toID } from 'pokemon-showdown/sim';
import { Container, Entity, IContainer } from '../../../../../../engine';
import { TypeIcon } from '../../../../../entities';

type MoveSlot = Pokemon['moveSlots'][number];

class PreviewMove extends Entity implements IContainer {
  container = new Container(this);

  constructor(moveSlot: MoveSlot) {
    super();

    const move = Dex.moves.get(moveSlot.id);
    this.container.add(
      Entity.text(move.name),
      Entity.text(`${moveSlot.pp}/${moveSlot.maxpp}`),
      new TypeIcon(toID(move.type))
    );
  }
}

export class PreviewMoves extends Entity implements IContainer {
  container = new Container(this);

  constructor(pokemon: Pokemon) {
    super();

    pokemon.moveSlots.forEach((moveSlot) => {
      this.container.add(new PreviewMove(moveSlot));
    });
  }
}
