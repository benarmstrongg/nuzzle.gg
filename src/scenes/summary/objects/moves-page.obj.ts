import { Dex, Pokemon } from '../../../../../pokemon-showdown/sim';
import { ContainerObject, TextObject } from '../../../engine';
import { TypeIcon } from '../../../objects';
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
            const typeIcon = new TypeIcon({
                position: { x: 248, y: 99 + 64 * i },
            });
            typeIcon.setType(moveData.type, this);
            const moveObj = new ContainerObject({
                sections: {
                    type: typeIcon,
                    name: new TextObject({
                        style: font({ size: 'xlarge' }),
                        position: { x: 318, y: 103 + 64 * i },
                        text: moveData.name,
                    }),
                    ppLabel: new TextObject({
                        style: font({ size: 'xlarge' }),
                        position: { x: 348, y: 135 + 64 * i },
                        text: 'PP',
                    }),
                    ppValue: new TextObject({
                        style: font({ size: 'xlarge' }),
                        position: { x: 408, y: 135 + 64 * i },
                        text: `${moveSlot.pp}/${moveSlot.maxpp}`,
                    }),
                },
            });
            this.$moves.addChild(moveObj);
        });
    }
}
