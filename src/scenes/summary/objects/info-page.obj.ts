import { Pokemon } from '../../../../../pokemon-showdown/sim';
import { ContainerObject, TextObject } from '../../../engine';
import { TypeIcon } from '../../../objects';
import { debugObject } from '../../../util/debug.util';
import { font } from '../../../util/font.util';
import { SummaryPage } from '../summary.types';

export class InfoPage extends ContainerObject implements SummaryPage {
    private $headerCol = debugObject(
        new ContainerObject({
            sections: {
                dexNo: new TextObject({
                    text: 'Pokedex No.',
                    style: font({ size: 'xxlarge', color: 'white' }),
                    position: { x: 295, y: 85 },
                    anchor: { x: 0.5, y: 0 },
                }),
                name: new TextObject({
                    text: 'Name',
                    style: font({ size: 'xxlarge', color: 'white' }),
                    position: { x: 290, y: 117 },
                    anchor: { x: 0.5, y: 0 },
                }),
                types: new TextObject({
                    text: 'Type',
                    style: font({ size: 'xxlarge', color: 'white' }),
                    position: { x: 290, y: 149 },
                    anchor: { x: 0.5, y: 0 },
                }),
                ot: new TextObject({
                    text: 'OT',
                    style: font({ size: 'xxlarge', color: 'white' }),
                    position: { x: 290, y: 181 },
                    anchor: { x: 0.5, y: 0 },
                }),
            },
        })
    );
    private $dataCol = new ContainerObject({
        sections: {
            dexNo: new TextObject({
                style: font({ size: 'xxlarge' }),
                position: { x: 435, y: 85 },
                anchor: { x: 0.5, y: 0 },
            }),
            name: new TextObject({
                style: font({ size: 'xxlarge' }),
                position: { x: 435, y: 117 },
                anchor: { x: 0.5, y: 0 },
            }),
            types: new ContainerObject({
                sections: {
                    type1: new TypeIcon({
                        position: { x: 0, y: 146 },
                        anchor: { x: 0.5, y: 0 },
                        scale: 0.9,
                    }),
                    type2: new TypeIcon({
                        position: { x: 0, y: 146 },
                        anchor: { x: 0.5, y: 0 },
                        scale: 0.9,
                    }),
                },
            }),
            ot: new TextObject({
                style: font({ size: 'xxlarge', color: 'red' }),
                position: { x: 435, y: 181 },
                anchor: { x: 0.5, y: 0 },
                text: 'h',
            }),
        },
    });

    constructor() {
        super();
        this.addChild(this.$headerCol, this.$dataCol);
    }

    setData(pokemon: Pokemon) {
        const { dexNo, name, types } = this.$dataCol.sections;
        const { type1, type2 } = types.sections;
        dexNo.setText(String(pokemon.species.num).padStart(4, '0'), this);
        name.setText(pokemon.species.name, this);
        type1.setType(pokemon.types[0], this);
        if (pokemon.types.length === 1) {
            type1.position.x = 435;
            type2.removeFromParent();
        } else {
            type1.position.x = 407;
            type2.position.x = 467;
            type2.setType(pokemon.types[1], this);
        }
    }
}
