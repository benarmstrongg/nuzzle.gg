import { Dex, Pokemon } from '@pkmn/sim';
import { Container, Entity } from 'nuzzlengine';
import { TypeIcon } from 'nuzzle.gg/entities';
import { toTypeId } from 'nuzzle.gg/util';

type MoveSlot = Pokemon['moveSlots'][number];

class PreviewMove extends Entity.Container {
  container = new Container(this);

  constructor(moveSlot: MoveSlot) {
    super();

    const move = Dex.moves.get(moveSlot.id);
    this.container.add(
      Entity.text(move.name),
      Entity.text(`${moveSlot.pp}/${moveSlot.maxpp}`),
      new TypeIcon(toTypeId(move.type))
    );
  }
}

export class PreviewMoves extends Entity.Container {
  container = new Container(this);

  constructor(pokemon: Pokemon) {
    super();

    pokemon.moveSlots.forEach((moveSlot) => {
      this.container.add(new PreviewMove(moveSlot));
    });
  }
}
