import { Assets, Container, Sprite, Text, Texture } from 'pixi.js';
import {
    OnInit,
    Scene,
    GameObject,
    ContainerObject,
    Random,
    Controls,
} from '../../engine';
import { PokemonSet } from '../../../../pokemon-showdown/sim/teams';
import { Dex } from '../../../../pokemon-showdown/sim';
import { ItemIcon, PokemonIcon, PokemonSprite, TypeIcon } from '../../objects';
import { font } from '../../util/font.util';

import {
    ASSETS,
    STORAGE,
    PREVIEW_PANEL,
    REQUIRED_ASSETS,
    BUTTONS,
} from './box.const';
import {
    StorageSlot,
    StorageRow,
    StorageGrid,
    BoxPage,
    BoxSlot,
} from './box.types';

export class Box extends Scene implements OnInit {
    private $cursor: GameObject<{
        hoveredSlot: BoxSlot;
        page: number;
        isHoldingPokemon: boolean;
    }>;
    private header: BoxSlot = {
        gridLocation: 'header',
        position: { x: -1, y: -1 },
    };
    private pages: BoxPage[] = [];
    private $previewPanel = new ContainerObject({
        sections: {
            name: new Text({
                style: font('xlarge'),
                position: PREVIEW_PANEL.NAME_POSITION,
            }),
            level: new Text({
                style: font('small'),
                position: PREVIEW_PANEL.LEVEL_POSITION,
            }),
            types: new ContainerObject({
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
            }),
            ability: new Text({
                style: font('medium'),
                position: PREVIEW_PANEL.ABILITY_POSITION,
            }),
            nature: new ContainerObject({
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
            }),
            sprite: new PokemonSprite({
                anchor: PREVIEW_PANEL.SPRITE_ANCHOR,
                position: PREVIEW_PANEL.SPRITE_POSITION,
                scale: PREVIEW_PANEL.SPRITE_SCALE,
            }),
            item: new ContainerObject({
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
            }),
            moves: new ContainerObject<
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
            }),
        },
    });
    private $partyButton = new Text({
        text: BUTTONS.PARTY.TEXT,
        style: font('heading', 'bold'),
        position: BUTTONS.PARTY.POSITION,
    });
    private $startButton = new Text({
        text: BUTTONS.START.TEXT,
        style: font('heading', 'bold'),
        position: BUTTONS.START.POSITION,
    });
    private $pokemonMenu = new ContainerObject({
        sections: {
            bg: new GameObject(),
            cursor: new GameObject(),
            options: new ContainerObject({
                sections: {
                    move: new Text({
                        style: font('medium'),
                    }),
                    summary: new Text({
                        style: font('medium'),
                        text: 'SUMMARY',
                    }),
                    item: new Text({
                        style: font('medium'),
                        text: 'ITEM',
                    }),
                    back: new Text({
                        style: font('medium'),
                        text: 'BACK',
                    }),
                },
            }),
        },
    });

    private get activePage(): (typeof this.pages)[number] {
        return this.pages[this.$cursor?.data.page || 0];
    }

    constructor(private readonly pokemonData: PokemonSet[]) {
        super();
    }

    async onInit(): Promise<void> {
        Assets.addBundle('fonts', [
            { alias: 'PowerGreen', src: 'assets/fonts/power-green.ttf' },
            {
                alias: 'PowerClearBold',
                src: 'assets/fonts/power-clear-bold.ttf',
            },
        ]);
        await Assets.loadBundle('fonts');
        await Assets.load(REQUIRED_ASSETS);
        Controls.selected.on('up', () => this.moveCursor('y', -1));
        Controls.selected.on('down', () => this.moveCursor('y', 1));
        Controls.selected.on('left', () => this.moveCursor('x', -1));
        Controls.selected.on('right', () => this.moveCursor('x', 1));
        Controls.selected.on('a', () => this.selectPokemon());
    }

    private async initPages(bg: Sprite) {
        let pageNum = 0;
        const [pageX, pageY] = [bg.width - 5, 15];
        while (
            pageNum <
            Math.ceil(
                this.pokemonData.length / (STORAGE.NUM_COLS * STORAGE.NUM_ROWS)
            )
        ) {
            const pageArt = ASSETS.PAGE_ART[Random.int(ASSETS.PAGE_ART.length)];
            await Assets.load(pageArt);
            const page: BoxPage = new GameObject({
                texture: Texture.from(pageArt),
                position: { x: pageX, y: pageY },
                anchor: { x: 1, y: 0 },
            });
            let grid: StorageRow[] = [];
            let row = 0;
            while (row < STORAGE.NUM_ROWS) {
                let gridRow: StorageSlot[] = [];
                for (
                    let i = STORAGE.NUM_COLS * row;
                    i < STORAGE.NUM_COLS * (row + 1);
                    i++
                ) {
                    const col = i % STORAGE.NUM_COLS;
                    const pokemon = this.pokemonData[i];
                    const x =
                        STORAGE.ICON_GAP +
                        page.x -
                        page.width +
                        STORAGE.ICON_WIDTH * col;
                    const y =
                        STORAGE.ICON_GAP + STORAGE.ICON_HEIGHT * (row + 1);
                    const slot: StorageSlot = {
                        position: { x, y },
                        gridLocation: { row, col },
                        pokemon: null,
                    };
                    if (pokemon) {
                        const icon = new PokemonIcon({ position: { x, y } });
                        await icon.setPokemon(pokemon.name, this.container);
                        slot.pokemon = { icon, set: pokemon };
                    }
                    gridRow.push(slot);
                }
                grid.push(gridRow as StorageRow);
                row++;
            }
            page.data.grid = grid as StorageGrid;
            this.pages.push(page);
            pageNum++;
        }
    }

    async render(): Promise<Container> {
        const scene = new Container();
        const bg = Sprite.from(ASSETS.BG);
        scene.addChild(bg);
        const mainOverlay = Sprite.from(ASSETS.MAIN_OVERLAY);
        scene.addChild(mainOverlay);
        await this.initPages(bg);
        for (const page of this.pages) {
            scene.addChild(page);
            for (const row of page.data.grid) {
                for (const slot of row) {
                    if (!slot.pokemon) {
                        continue;
                    }
                    scene.addChild(slot.pokemon.icon);
                }
            }
        }
        this.header.position = {
            x: this.activePage.x - this.activePage.width / 2,
            y: this.activePage.y - STORAGE.ICON_HEIGHT / 2,
        };
        this.$cursor = new GameObject({
            width: 64,
            height: 64,
            texture: Texture.from(ASSETS.CURSOR_GRAB),
            data: {
                hoveredSlot: this.header,
                page: 0,
                isHoldingPokemon: false,
            },
            position: this.header.position,
        });
        scene.addChild(
            this.$cursor,
            this.$previewPanel,
            this.$partyButton,
            this.$startButton
        );
        scene.scale.set(1.5);
        setTimeout(() => console.log(this.container.children), 100);
        return scene;
    }

    private moveCursor(axis: 'x' | 'y', distance: 1 | -1) {
        this.clearPreview();
        if (this.$cursor.data.hoveredSlot.gridLocation === 'header') {
            if (axis === 'x') {
                return;
            }
            const nextRow = distance === 1 ? 0 : STORAGE.NUM_ROWS - 1;
            const nextSlot = this.activePage.data.grid[nextRow][2];
            return this.moveCursorToSlot(nextSlot);
        }
        const { row, col } = this.$cursor.data.hoveredSlot.gridLocation;
        const nextCol = axis === 'x' ? col + distance : col;
        const nextRow = axis === 'y' ? row + distance : row;
        const nextSlot = this.activePage.data.grid[nextRow]?.[nextCol];
        if (!nextSlot) {
            if (axis === 'y') {
                this.$cursor.data.hoveredSlot.gridLocation = 'header';
                return this.$cursor.moveTo(this.header.position);
            } else {
                const endCol = distance === 1 ? 0 : STORAGE.NUM_COLS - 1;
                const nextSlot = this.activePage.data.grid[nextRow]?.[endCol];
                return this.moveCursorToSlot(nextSlot, 2);
            }
        }
        return this.moveCursorToSlot(nextSlot);
    }

    private async moveCursorToSlot(slot: StorageSlot, speed = 1) {
        this.$cursor.data.hoveredSlot = slot;
        this.$cursor.moveTo({
            x: slot.position.x + STORAGE.CURSOR_OFFSET_X,
            y: slot.position.y + STORAGE.CURSOR_OFFSET_Y,
            speed,
        });
        if (slot.pokemon) {
            await this.updatePreview(slot.pokemon.set);
        }
    }

    private async clearPreview() {
        this.container.removeChild(this.$previewPanel);
    }

    private async updatePreview(set: PokemonSet) {
        const { name, level, types, ability, nature, sprite, item, moves } =
            this.$previewPanel.sections;
        const speciesData = Dex.species.get(set.name);
        name.text = speciesData.baseSpecies;
        level.text = `lvl ${set.level}`;
        await types.sections.type1.setType(speciesData.types[0]);
        if (speciesData.types[1]) {
            await types.sections.type2.setType(speciesData.types[1], types);
        } else {
            types.sections.type2.removeFromParent();
        }
        ability.text = set.ability;
        const natureData = Dex.natures.get(set.nature);
        if (natureData.plus) {
            nature.sections.plus.text = `+${natureData.plus}`.toUpperCase();
        }
        if (natureData.minus) {
            nature.sections.minus.text = `-${natureData.minus}`.toUpperCase();
        }
        await sprite.setPokemon(set.name);
        if (set.item) {
            await item.sections.icon.setItem(set.item);
        }
        item.sections.name.text = set.item;
        for (let i = 0; i < set.moves.length; i++) {
            const moveName = set.moves[i];
            const moveData = Dex.moves.get(moveName);
            const move = moves.children[i];
            move.sections.name.text = moveData.name;
            move.sections.pp.text = `${moveData.pp}/${moveData.pp}`;
            await move.sections.type.setType(moveData.type);
        }
        this.container.addChild(this.$previewPanel);
    }

    private selectPokemon() {
        this.$cursor.data.isHoldingPokemon =
            !this.$cursor.data.isHoldingPokemon;
        const asset = this.$cursor.data.isHoldingPokemon
            ? ASSETS.CURSOR_GRAB
            : ASSETS.CURSOR_FIST;
        this.$cursor.setTexture(Texture.from(asset));
    }
}
