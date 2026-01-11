import { Dex, Pokemon } from 'pokemon-showdown/sim';
import { ContainerObject, TextObject } from '../../../../engine';
import { TypeIcon } from '../../../entities';
import { CategoryIcon } from '../../../entities/CategoryIcon.entity';
import { font } from '../../../util/font.util';

import { SummaryPage } from '../summary.types';

export class MovesPage extends ContainerObject implements SummaryPage {
  private $moves = new ContainerObject<{}, ContainerObject>();

  constructor() {
    super();
    this.addChild(this.$moves);
  }
  setData(pokemon: Pokemon) {
    this.$moves.removeChildren();
    pokemon.moveSlots.forEach((moveSlot, i) => {
      const moveData = Dex.moves.get(moveSlot.id);
      const firstRowPosY = 113 + 64 * i;
      const secondRowPosY = 145 + 64 * i;
      const anchor = { x: 0, y: 0.5 };
      const typeIcon = new TypeIcon({
        position: { x: 248, y: firstRowPosY },
        anchor,
      });
      typeIcon.setType(moveData.type, this);
      const categoryIcon = new CategoryIcon({
        position: { x: 420, y: secondRowPosY },
        anchor,
      });
      categoryIcon.setCategory(moveData.category, this);
      const moveObj = new ContainerObject({
        sections: {
          type: typeIcon,
          name: new TextObject({
            style: font({ size: 'xlarge' }),
            position: { x: 318, y: firstRowPosY },
            text: moveData.name,
            anchor,
          }),
          category: categoryIcon,
          ppLabel: new TextObject({
            style: font({ size: 'xlarge' }),
            position: { x: 316, y: secondRowPosY },
            text: 'PP',
            anchor,
          }),
          ppValue: new TextObject({
            style: font({ size: 'xlarge' }),
            position: { x: 338, y: secondRowPosY },
            text: `${moveSlot.pp}/${moveSlot.maxpp}`,
            anchor,
          }),
        },
      });
      this.$moves.addChild(moveObj);
    });
  }
}
