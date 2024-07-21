import { Assets, Container, Texture } from 'pixi.js';
import {
    ContainerObject,
    Controls,
    OnDestroy,
    OnInit,
    AfterRender,
    Scene,
    SpriteObject,
    TextObject,
} from '../../engine';
import { Battle, Dex, Pokemon, toID } from '../../../../pokemon-showdown/sim';
import {
    HpBar,
    MessageBox,
    PokemonSprite,
    StatusIcon,
    TypeIcon,
} from '../../objects';
import { PokemonSet } from '../../../../pokemon-showdown/sim/teams';
import { draggable } from '../../util/debug.util';
import { ASSETS, REQUIRED_ASSETS, Z_INDEX } from './battle.const';
import { CommandButton } from './objects/command-button.obj';
import { font } from '../../util/font.util';
import { MoveButton } from './objects/move-button.obj';
import { BattleButton } from './objects/button.obj';

type SideSections = {
    pokemon: PokemonSprite;
    hp: HpBar;
    hpLabel: TextObject;
    nickname: TextObject;
    levelLabel: SpriteObject;
    level: TextObject;
    status: StatusIcon;
};

type SideData = { side: 'user' | 'foe' };

type OverlayButtonsData<TButton extends BattleButton> = {
    hoveredButton: TButton;
};

export class BattleScene
    extends Scene
    implements OnInit, AfterRender, OnDestroy
{
    private controls: Controls;
    private battle: Battle;
    private logs: string[] = [];
    activeUserPokemon: Pokemon;
    private $userSide = new ContainerObject<SideSections>({
        zIndex: Z_INDEX.POKEMON,
        data: { side: 'user' },
        sections: {
            pokemon: draggable(
                new PokemonSprite({
                    type: 'back',
                    position: { x: 82, y: 96 },
                    scale: 1.5,
                })
            ),
            hp: draggable(new HpBar({ position: { x: 388, y: 141.5 } })),
            hpLabel: draggable(
                new TextObject({
                    style: font({ size: 'xlarge' }),
                    position: { x: 398, y: 151 },
                })
            ),
            nickname: draggable(
                new TextObject({
                    style: font({ size: 'heading' }),
                    position: { x: 294, y: 110 },
                })
            ),
            levelLabel: draggable(
                new SpriteObject({
                    position: { x: 450, y: 120 },
                })
            ),
            level: draggable(
                new TextObject({
                    style: font({ size: 'xxlarge' }),
                    position: { x: 474, y: 114 },
                })
            ),
            status: draggable(new StatusIcon({ position: { x: 300, y: 150 } })),
        },
    });
    private $foeSide = new ContainerObject<SideSections, Container, SideData>({
        zIndex: Z_INDEX.POKEMON,
        data: { side: 'foe' },
        sections: {
            pokemon: draggable(
                new PokemonSprite({
                    position: { x: 340, y: 56 },
                    anchor: { x: 0, y: 0.5 },
                })
            ),
            hp: draggable(new HpBar({ position: { x: 119, y: 70 } })),
            hpLabel: draggable(
                new TextObject({
                    style: font({ size: 'xsmall' }),
                    position: { x: 219, y: 68 },
                })
            ),
            nickname: draggable(
                new TextObject({
                    style: font({ size: 'heading' }),
                    position: { x: 10, y: 36 },
                })
            ),
            levelLabel: draggable(
                new SpriteObject({
                    position: { x: 170, y: 49 },
                })
            ),
            level: draggable(
                new TextObject({
                    style: font({ size: 'xxlarge' }),
                    position: { x: 194, y: 43 },
                })
            ),
            status: draggable(new StatusIcon({ position: { x: 30, y: 66 } })),
        },
    });
    private $commandOverlay = new ContainerObject({
        zIndex: Z_INDEX.OVERLAY,
        sections: {
            message: new ContainerObject({
                sections: {
                    box: new SpriteObject({
                        position: { x: 0, y: 188 },
                        zIndex: Z_INDEX.OVERLAY,
                    }),
                    text: new TextObject({
                        style: font({
                            size: 'xxlarge',
                            wrap: true,
                            wrapWidth: 220,
                            lineHeight: 30,
                        }),
                        position: { x: 24, y: 204 },
                    }),
                },
            }),
            buttons: new ContainerObject<
                {},
                CommandButton,
                OverlayButtonsData<CommandButton>
            >({
                data: { hoveredGridPosition: [0, 0] },
                position: { x: 250, y: 192 },
                zIndex: Z_INDEX.BUTTONS,
            }),
        },
    });
    private $fightOverlay = new ContainerObject({
        zIndex: Z_INDEX.OVERLAY,
        visible: false,
        sections: {
            buttons: new ContainerObject<
                {},
                MoveButton,
                OverlayButtonsData<MoveButton>
            >({
                data: { hoveredGridPosition: [0, 0] },
                position: { x: 0, y: 192 },
                zIndex: Z_INDEX.BUTTONS,
            }),
            labels: new ContainerObject<{}, TextObject>({
                position: { x: 0, y: 192 },
                zIndex: Z_INDEX.BUTTONS,
            }),
            info: new ContainerObject({
                sections: {
                    box: draggable(
                        new SpriteObject({
                            position: { x: 0, y: 192 },
                            zIndex: Z_INDEX.OVERLAY,
                        })
                    ),
                    type: draggable(
                        new TypeIcon({
                            position: { x: 448, y: 214 },
                            zIndex: Z_INDEX.BUTTONS,
                            anchor: { x: 0.5, y: 0 },
                        })
                    ),
                    pp: draggable(
                        new TextObject({
                            style: font({ size: 'large' }),
                            position: { x: 448, y: 248 },
                            anchor: { x: 0.5, y: 0 },
                            zIndex: Z_INDEX.BUTTONS,
                        })
                    ),
                },
            }),
        },
    });
    private $messageBox = new MessageBox({});

    constructor(userPokemon: PokemonSet[], foePokemon: PokemonSet[]) {
        super();
        this.battle = new Battle({
            formatid: toID('gen9randombattle'),
            p1: { name: 'ben', team: userPokemon },
            p2: { name: 'foe', team: foePokemon },
        });
        this.logTurn();
    }

    async onInit() {
        await Assets.load(REQUIRED_ASSETS);
        await CommandButton.load();
        await MoveButton.load();
        await StatusIcon.load();
        await HpBar.load();
        await TypeIcon.load();
        await this.$messageBox.init();
        this.controls = Controls.selected();
        this.controls.on('up', () => this.moveCursor('y'));
        this.controls.on('down', () => this.moveCursor('y'));
        this.controls.on('left', () => this.moveCursor('x'));
        this.controls.on('right', () => this.moveCursor('x'));
        this.controls.on('a', () => this.select());
        this.controls.on('b', () => this.cancel());
    }

    onDestroy() {
        this.controls.clear();
    }

    render(): ContainerObject {
        const $bg = new SpriteObject({
            texture: Texture.from(ASSETS.BG),
            zIndex: Z_INDEX.BG,
        });
        const $messageBg = new SpriteObject({
            texture: Texture.from(ASSETS.MESSAGE_BG),
            zIndex: Z_INDEX.BG,
            position: { x: 0, y: 188 },
        });
        const $base = new SpriteObject({
            texture: Texture.from(ASSETS.BASE),
            position: { x: -90, y: 155 },
            zIndex: Z_INDEX.BASE,
        });
        const $baseFoe = new SpriteObject({
            texture: Texture.from(ASSETS.BASE_FOE),
            position: { x: 258, y: 25 },
            zIndex: Z_INDEX.BASE,
        });
        const $databox = new SpriteObject({
            texture: Texture.from(ASSETS.DATABOX),
            position: { x: 252, y: 102 },
            zIndex: Z_INDEX.DATABOX,
        });
        const $databoxFoe = new SpriteObject({
            texture: Texture.from(ASSETS.DATABOX_FOE),
            position: { x: 0, y: 30 },
            zIndex: Z_INDEX.DATABOX,
        });
        this.$commandOverlay.sections.message.sections.box.setTexture(
            Texture.from(ASSETS.OVERLAY_COMMAND),
            this.$commandOverlay.sections.message
        );
        this.$commandOverlay.sections.buttons.addChild(
            new CommandButton({
                command: 'fight',
                gridPosition: [0, 0],
                position: { x: 0, y: 0 },
            }),
            new CommandButton({
                command: 'bag',
                gridPosition: [0, 1],
                position: { x: CommandButton.width, y: 0 },
            }),
            new CommandButton({
                command: 'pokemon',
                gridPosition: [1, 0],
                position: { x: 0, y: CommandButton.height },
            }),
            new CommandButton({
                command: 'run',
                gridPosition: [1, 1],
                position: {
                    x: CommandButton.width,
                    y: CommandButton.height,
                },
            })
        );
        this.$commandOverlay.sections.buttons.data.hoveredButton =
            this.$commandOverlay.sections.buttons.children[0];
        this.activeUserPokemon = this.battle.p1.pokemon[0];
        this.$fightOverlay.sections.info.sections.box.setTexture(
            Texture.from(ASSETS.OVERLAY_FIGHT),
            this.$fightOverlay.sections.info
        );
        return new ContainerObject([
            $bg,
            $messageBg,
            $base,
            $baseFoe,
            $databox,
            $databoxFoe,
            this.$userSide,
            this.$foeSide,
            this.$commandOverlay,
            this.$fightOverlay,
        ]);
    }

    async afterRender() {
        await this.switchPokemon(this.$userSide, this.battle.p1.pokemon[0]);
        await this.switchPokemon(this.$foeSide, this.battle.p2.pokemon[0]);
    }

    private async switchPokemon(
        $side: ContainerObject<SideSections, Container, SideData>,
        pokemonData: Pokemon
    ) {
        const isUserSide = $side.data.side === 'user';
        const { pokemon, nickname, hp, hpLabel, levelLabel, level, status } =
            $side.sections;
        await pokemon.setPokemon(pokemonData.species, $side);
        nickname.setText(pokemonData.name, $side);
        hp.setHp(pokemonData.hp / pokemonData.maxhp, false, $side);
        const hpLabelText = isUserSide
            ? `${pokemonData.hp}/${pokemonData.maxhp}`
            : `${Math.round((pokemonData.hp / pokemonData.maxhp) * 100)}%`;
        hpLabel.setText(hpLabelText, $side);
        levelLabel.setTexture(Texture.from(ASSETS.LEVEL_LABEL), $side);
        level.setText(pokemonData.level.toString(), $side);
        status.setStatus(toID(pokemonData.status), $side);
        if (isUserSide) {
            this.switchUserPokemon(pokemonData);
        }
    }

    private switchUserPokemon(pokemonData: Pokemon) {
        this.$commandOverlay.sections.message.sections.text.setText(
            `What will ${pokemonData.name} do?`,
            this.$commandOverlay
        );

        const moveData = pokemonData.moves.map((move) =>
            Dex.moves.get(toID(move))
        );
        this.$fightOverlay.sections.buttons.removeChildren();
        const moveButtons = [
            new MoveButton({
                moveData: moveData[0],
                gridPosition: [0, 0],
                position: { x: 0, y: 0 },
            }),
            moveData[1] &&
                new MoveButton({
                    moveData: moveData[1],
                    gridPosition: [0, 1],
                    position: { x: MoveButton.width, y: 0 },
                }),
            moveData[2] &&
                new MoveButton({
                    moveData: moveData[2],
                    gridPosition: [1, 0],
                    position: { x: 0, y: MoveButton.height },
                }),
            moveData[3] &&
                new MoveButton({
                    moveData: moveData[3],
                    gridPosition: [1, 1],
                    position: { x: MoveButton.width, y: MoveButton.height },
                }),
        ].filter((btn) => !!btn);
        this.$fightOverlay.sections.buttons.addChild(...moveButtons);
        this.$fightOverlay.sections.buttons.data.hoveredButton = moveButtons[0];
        const moveLabels = [
            draggable(
                new TextObject({
                    style: font({ size: 'xxlarge' }),
                    text: moveData[0].name,
                    position: { x: 94, y: 12 },
                    anchor: { x: 0.5, y: 0 },
                })
            ),
            moveData[1] &&
                new TextObject({
                    style: font({ size: 'xxlarge' }),
                    text: moveData[1].name,
                    position: { x: 94 + MoveButton.width, y: 12 },
                    anchor: { x: 0.5, y: 0 },
                }),
            moveData[2] &&
                new TextObject({
                    style: font({ size: 'xxlarge' }),
                    text: moveData[2].name,
                    position: { x: 94, y: 12 + MoveButton.height },
                    anchor: { x: 0.5, y: 0 },
                }),
            moveData[3] &&
                new TextObject({
                    style: font({ size: 'xxlarge' }),
                    text: moveData[3].name,
                    position: {
                        x: 94 + MoveButton.width,
                        y: 12 + MoveButton.height,
                    },
                    anchor: { x: 0.5, y: 0 },
                }),
        ].filter((btn) => !!btn);
        this.$fightOverlay.sections.labels.addChild(...moveLabels);
        this.updateMoveInfo(pokemonData.moveSlots[0]);
    }

    moveCursor(axis: 'x' | 'y') {
        const $overlay = this.$fightOverlay.visible
            ? this.$fightOverlay
            : this.$commandOverlay;
        const $buttons = $overlay.sections.buttons;
        const [row, col] = $buttons.data.hoveredButton.gridPosition;
        let [nextRow, nextCol] = [row, col];
        if (axis === 'x') {
            nextCol = col === 0 ? 1 : 0;
        } else {
            nextRow = row === 0 ? 1 : 0;
        }
        const buttons = $buttons.children.slice();
        buttons.forEach((btn) => {
            if (
                btn.gridPosition[0] === nextRow &&
                btn.gridPosition[1] === nextCol
            ) {
                $buttons.data.hoveredButton = btn;
                return btn.hover($buttons);
            }
            btn.unhover($buttons);
        });
        if (this.$fightOverlay.visible) {
            const hoveredMoveSlot = this.activeUserPokemon.moveSlots.find(
                (move) =>
                    move.id ===
                    ($buttons.data.hoveredButton as MoveButton).moveData.id
            )!;
            this.updateMoveInfo(hoveredMoveSlot);
        }
    }

    select() {
        if (this.$fightOverlay.visible) {
            const { moveData } =
                this.$fightOverlay.sections.buttons.data.hoveredButton;
            this.battle.p1.chooseMove(moveData.id);
            this.battle.p2.chooseMove(0);
            this.battle.commitDecisions();
            this.logTurn();
            this.$fightOverlay.visible = false;
            this.$commandOverlay.visible = true;
            return;
        }
        switch (
            this.$commandOverlay.sections.buttons.data.hoveredButton.textureId
        ) {
            case 'fight':
                this.$commandOverlay.visible = false;
                this.$fightOverlay.visible = true;
                break;
            case 'party':
            case 'bag':
            case 'run':
                break;
        }
    }

    cancel() {
        if (this.$fightOverlay.visible) {
            this.$commandOverlay.visible = true;
            this.$fightOverlay.visible = false;
            return;
        }
        if (
            this.$commandOverlay.sections.buttons.data.hoveredButton
                .textureId === 'run'
        ) {
            // TODO: run
            return;
        }
        const $buttons = this.$commandOverlay.sections.buttons;
        $buttons.children.slice().forEach((btn) => {
            if (btn.textureId === 'run') {
                $buttons.data.hoveredButton = btn;
                return btn.hover($buttons);
            }
            btn.unhover($buttons);
        });
    }

    private updateMoveInfo(move: Pokemon['moveSlots'][number]) {
        const moveData = Dex.moves.get(move.id);
        this.$fightOverlay.sections.info.sections.box.render(
            this.$fightOverlay.sections.info
        );
        this.$fightOverlay.sections.info.sections.type.setType(
            moveData.type,
            this.$fightOverlay.sections.info
        );
        this.$fightOverlay.sections.info.sections.pp.setText(
            `PP: ${move.pp}/${move.maxpp}`,
            this.$fightOverlay.sections.info
        );
    }

    private logTurn(): string[] {
        const newLogs = this.battle.log.slice(this.logs.length);
        newLogs.forEach((log) => {
            this.logs.push(log);
            const isDisplayLog = true;
            if (isDisplayLog) {
                console.log(log);
            }
        });
        return newLogs;
    }
}
