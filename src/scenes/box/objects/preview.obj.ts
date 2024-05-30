import { Container, Text } from 'pixi.js';
import { ContainerObject } from '../../../engine';
import { ItemIcon, PokemonSprite, TypeIcon } from '../../../objects';
import { font } from '../../../util/font.util';
import { PREVIEW_PANEL } from '../box.const';
import { PokemonSet } from '../../../../../pokemon-showdown/sim/teams';
import { Dex } from '../../../../../pokemon-showdown/sim';

export class BoxPreview extends ContainerObject {
    private $name = new Text({
        style: font('xlarge'),
        position: PREVIEW_PANEL.NAME_POSITION,
    });
    private $level = new Text({
        style: font('small'),
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
    private $ability = new Text({
        style: font('medium'),
        position: PREVIEW_PANEL.ABILITY_POSITION,
    });
    private $nature = new ContainerObject({
        sections: {
            plus: new Text({
                style: font('medium', 'regular', 'red'),
                position: PREVIEW_PANEL.NATURE_PLUS_POSITION,
            }),
            minus: new Text({
                style: font('medium', 'regular', 'blue'),
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
            }),
            name: new Text({
                style: font('medium'),
                anchor: PREVIEW_PANEL.ITEM_ANCHOR,
                position: PREVIEW_PANEL.ITEM_NAME_POSITION,
            }),
        },
    });
    private $moves = new ContainerObject<
        {},
        ContainerObject<{
            name: Text;
            type: TypeIcon;
            pp: Text;
        }>
    >({
        children: [0, 1, 2, 3].map(
            (i) =>
                new ContainerObject({
                    sections: {
                        name: new Text({
                            position: {
                                x: PREVIEW_PANEL.MOVE_NAME_POSITION_X,
                                y:
                                    PREVIEW_PANEL.MOVE_1_NAME_POSITION_Y +
                                    i * PREVIEW_PANEL.MOVE_GAP_Y,
                            },
                            style: font('large'),
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
                        pp: new Text({
                            anchor: PREVIEW_PANEL.MOVE_TYPE_PP_ANCHOR,
                            position: {
                                x: PREVIEW_PANEL.MOVE_TYPE_PP_POSITION_X,
                                y:
                                    PREVIEW_PANEL.MOVE_1_PP_POSITION_Y +
                                    i * PREVIEW_PANEL.MOVE_GAP_Y,
                            },
                            style: font('small'),
                        }),
                    },
                })
        ),
    });

    init() {
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

    async update(set: PokemonSet, container: Container) {
        const speciesData = Dex.species.get(set.name);
        this.$name.text = speciesData.baseSpecies;
        this.$level.text = `lvl ${set.level}`;
        await this.$types.sections.type1.setType(
            speciesData.types[0],
            this.$types
        );
        if (speciesData.types[1]) {
            await this.$types.sections.type2.setType(
                speciesData.types[1],
                this.$types
            );
        } else {
            this.$types.sections.type2.removeFromParent();
        }
        this.$ability.text = set.ability;
        const natureData = Dex.natures.get(set.nature);
        if (natureData.plus) {
            this.$nature.sections.plus.text =
                `+${natureData.plus}`.toUpperCase();
        }
        if (natureData.minus) {
            this.$nature.sections.minus.text =
                `-${natureData.minus}`.toUpperCase();
        }
        await this.$sprite.setPokemon(set.name, this);
        if (set.item) {
            await this.$item.sections.icon.setItem(set.item, this.$item);
        }
        this.$item.sections.name.text = set.item;
        for (let i = 0; i < set.moves.length; i++) {
            const moveName = set.moves[i];
            const moveData = Dex.moves.get(moveName);
            const move = this.$moves.children[i];
            move.sections.name.text = moveData.name;
            move.sections.pp.text = `${moveData.pp}/${moveData.pp}`;
            await move.sections.type.setType(moveData.type, move);
        }
        container.addChild(this);
    }
}
