import { ContainerObject, TextObject } from '../../../engine';
import { ItemIcon, PokemonSprite, TypeIcon } from '../../../objects';
import { font } from '../../../util/font.util';
import { PREVIEW_PANEL } from '../box.const';
import { Dex, Pokemon } from '../../../../../pokemon-showdown/sim';

export class BoxPreview extends ContainerObject {
    private $name = new TextObject({
        style: font({ size: 'xlarge' }),
        position: PREVIEW_PANEL.NAME_POSITION,
    });
    private $level = new TextObject({
        style: font({ size: 'small' }),
        position: PREVIEW_PANEL.LEVEL_POSITION,
    });
    private $types = new ContainerObject({
        sections: {
            type1: new TypeIcon({
                anchor: PREVIEW_PANEL.TYPE_ANCHOR,
                position: PREVIEW_PANEL.TYPE_1_POSITION,
                scale: PREVIEW_PANEL.TYPE_SCALE,
            }),
            type2: new TypeIcon({
                anchor: PREVIEW_PANEL.TYPE_ANCHOR,
                position: PREVIEW_PANEL.TYPE_2_POSITION,
                scale: PREVIEW_PANEL.TYPE_SCALE,
            }),
        },
    });
    private $ability = new TextObject({
        style: font({ size: 'medium' }),
        position: PREVIEW_PANEL.ABILITY_POSITION,
    });
    private $nature = new ContainerObject({
        sections: {
            plus: new TextObject({
                style: font({ size: 'medium', color: 'red' }),
                position: PREVIEW_PANEL.NATURE_PLUS_POSITION,
            }),
            minus: new TextObject({
                style: font({ size: 'medium', color: 'blue' }),
                position: PREVIEW_PANEL.NATURE_MINUS_POSITION,
            }),
        },
    });
    private $sprite = new PokemonSprite({
        anchor: PREVIEW_PANEL.SPRITE_ANCHOR,
        position: PREVIEW_PANEL.SPRITE_POSITION,
        scale: PREVIEW_PANEL.SPRITE_SCALE,
    });
    private $item = new ContainerObject({
        sections: {
            icon: new ItemIcon({
                anchor: PREVIEW_PANEL.ITEM_ANCHOR,
                position: PREVIEW_PANEL.ITEM_ICON_POSITION,
                scale: 0.8,
            }),
            name: new TextObject({
                style: font({ size: 'medium' }),
                anchor: PREVIEW_PANEL.ITEM_ANCHOR,
                position: PREVIEW_PANEL.ITEM_NAME_POSITION,
            }),
        },
    });
    private $moves = new ContainerObject<
        {},
        ContainerObject<{
            name: TextObject;
            type: TypeIcon;
            pp: TextObject;
        }>
    >(
        [0, 1, 2, 3].map(
            (i) =>
                new ContainerObject({
                    sections: {
                        name: new TextObject({
                            position: {
                                x: PREVIEW_PANEL.MOVE_NAME_POSITION_X,
                                y:
                                    PREVIEW_PANEL.MOVE_1_NAME_POSITION_Y +
                                    i * PREVIEW_PANEL.MOVE_GAP_Y,
                            },
                            style: font({ size: 'large' }),
                        }),
                        type: new TypeIcon({
                            anchor: PREVIEW_PANEL.MOVE_TYPE_PP_ANCHOR,
                            position: {
                                x: PREVIEW_PANEL.MOVE_TYPE_PP_POSITION_X,
                                y:
                                    PREVIEW_PANEL.MOVE_1_TYPE_POSITION_Y +
                                    i * PREVIEW_PANEL.MOVE_GAP_Y,
                            },
                            scale: PREVIEW_PANEL.TYPE_SCALE,
                        }),
                        pp: new TextObject({
                            anchor: PREVIEW_PANEL.MOVE_TYPE_PP_ANCHOR,
                            position: {
                                x: PREVIEW_PANEL.MOVE_TYPE_PP_POSITION_X,
                                y:
                                    PREVIEW_PANEL.MOVE_1_PP_POSITION_Y +
                                    i * PREVIEW_PANEL.MOVE_GAP_Y,
                            },
                            style: font({ size: 'small' }),
                        }),
                    },
                })
        )
    );

    constructor() {
        super();
        this.addChild(
            this.$name,
            this.$level,
            this.$types,
            this.$ability,
            this.$nature,
            this.$sprite,
            this.$item,
            this.$moves
        );
    }

    clear() {
        this.removeChildren();
    }

    async update(pokemon: Pokemon, container: ContainerObject) {
        const speciesData = Dex.species.get(pokemon.name);
        this.$name.setText(speciesData.baseSpecies, this);
        this.$level.setText(`lvl ${pokemon.level}`, this);
        this.$types.sections.type1.setType(speciesData.types[0], this);
        if (speciesData.types[1]) {
            this.$types.sections.type2.setType(speciesData.types[1], this);
        } else {
            this.$types.sections.type2.removeFromParent();
        }
        const abilityData = Dex.abilities.get(pokemon.ability);
        this.$ability.setText(abilityData.name, this);
        const natureData = Dex.natures.get(pokemon.set.nature);
        if (natureData.plus) {
            this.$nature.sections.plus.setText(
                `+${natureData.plus}`.toUpperCase(),
                this
            );
        }
        if (natureData.minus) {
            this.$nature.sections.minus.setText(
                `-${natureData.minus}`.toUpperCase(),
                this
            );
        }
        await this.$sprite.setPokemon(pokemon.species, this);
        if (pokemon.item) {
            const itemData = Dex.items.get(pokemon.item);
            await this.$item.sections.icon.setItem(pokemon.item, this);
            this.$item.sections.name.setText(itemData.name, this);
        }
        pokemon.moveSlots.forEach((moveSlot, i) => {
            const moveData = Dex.moves.get(moveSlot.id);
            const moveObj = this.$moves.children[i];
            moveObj.sections.name.setText(moveData.name, this);
            moveObj.sections.pp.setText(
                `${moveSlot.pp}/${moveSlot.maxpp}`,
                this
            );
            moveObj.sections.type.setType(moveData.type, this);
        });
        container.addChild(this);
    }
}
