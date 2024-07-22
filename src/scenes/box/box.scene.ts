import { Assets, Sprite, Texture } from 'pixi.js';
import { Pokemon } from '../../../../pokemon-showdown/sim';
import {
    OnInit,
    OnDestroy,
    Scene,
    ContainerObject,
    Controls,
    App,
    AfterRender,
    TextObject,
} from '../../engine';
import { font } from '../../util/font.util';
import { Menu, TypeIcon } from '../../objects';

import { BoxCursor } from './objects/cursor.obj';
import { BoxPage } from './objects/page.obj';
import { BoxPreview } from './objects/preview.obj';
import {
    ASSETS,
    STORAGE,
    REQUIRED_ASSETS,
    BUTTONS,
    MENU_ITEMS,
} from './box.const';
import { SummaryScene } from '../summary/summary.scene';
import { BoxPartyTray } from './objects/party-tray.obj';

export class BoxScene extends Scene implements OnInit, AfterRender, OnDestroy {
    private $boxCursor: BoxCursor;
    private pages: BoxPage[] = [];
    private activePageIndex = 0;
    private $preview = new BoxPreview();
    private $partyButton = new TextObject({
        text: BUTTONS.PARTY.TEXT,
        style: font({ size: 'heading', weight: 'bold' }),
        position: BUTTONS.PARTY.POSITION,
    });
    private $startButton = new TextObject({
        text: BUTTONS.START.TEXT,
        style: font({ size: 'heading', weight: 'bold' }),
        position: BUTTONS.START.POSITION,
    });
    private $pokemonStorageMenu: Menu<
        typeof MENU_ITEMS.POKEMON_STORAGE,
        { pokemon: Pokemon }
    >;
    private $itemMenu: Menu<typeof MENU_ITEMS.ITEM>;
    private $partyTray = new BoxPartyTray();
    private controls: Controls;

    constructor(private readonly pokemonData: Pokemon[]) {
        super();
    }

    async onInit(): Promise<void> {
        await Assets.load(REQUIRED_ASSETS);
        await TypeIcon.load();
        this.$pokemonStorageMenu = await Menu.init({
            onSelect: (action) => this.onPokemonMenuSelect(action),
            items: MENU_ITEMS.POKEMON_STORAGE,
        });
        this.$itemMenu = await Menu.init({
            onSelect: (action) => this.onItemMenuSelect(action),
            items: MENU_ITEMS.ITEM,
        });
        this.controls = Controls.selected();
        this.controls.on('up', () => this.moveCursor('y', -1));
        this.controls.on('down', () => this.moveCursor('y', 1));
        this.controls.on('left', () => this.moveCursor('x', -1));
        this.controls.on('right', () => this.moveCursor('x', 1));
        this.controls.on('a', () => this.select());
        this.controls.on('b', () => this.cancel());
    }

    onDestroy() {
        this.controls.clear();
    }

    render(): ContainerObject {
        const scene = new ContainerObject([
            Sprite.from(ASSETS.BG),
            Sprite.from(ASSETS.MAIN_OVERLAY),
        ]);
        this.$boxCursor = new BoxCursor({
            partyTray: this.$partyTray,
            onPageChange: (direction) => this.onPageChange(direction),
        });
        this.$partyTray.init();
        scene.addChild(
            this.$boxCursor,
            this.$preview,
            this.$partyButton,
            this.$startButton,
            this.$partyTray
        );
        return scene;
    }

    async afterRender() {
        let pageNum = 0;
        while (
            pageNum <
            Math.ceil(
                this.pokemonData.length / (STORAGE.NUM_COLS * STORAGE.NUM_ROWS)
            )
        ) {
            const pagePokemonData = this.pokemonData.slice(
                pageNum * STORAGE.PAGE_SIZE,
                (pageNum + 1) * STORAGE.PAGE_SIZE
            );
            const page = new BoxPage();
            await page.init(pagePokemonData);
            this.pages.push(page);
            page.render(this.container);
            pageNum++;
        }
        await this.$boxCursor.init(this.pages[0], this.container);
        this.$boxCursor.setTexture(
            Texture.from(ASSETS.CURSOR_GRAB),
            this.container
        );
    }

    private moveCursor(axis: 'x' | 'y', distance: 1 | -1) {
        if (this.$pokemonStorageMenu.isOpen) {
            if (axis === 'x') {
                return;
            }
            return this.$pokemonStorageMenu.moveCursor(distance);
        } else if (this.$itemMenu.isOpen) {
            if (axis === 'x') {
                return;
            }
            return this.$itemMenu.moveCursor(distance);
        } else if (this.$partyTray.isOpen) {
            return this.movePartyCursor(axis, distance);
        }
        return this.moveBoxCursor(axis, distance);
    }

    private select() {
        if (this.$pokemonStorageMenu.isOpen) {
            return this.$pokemonStorageMenu.select();
        } else if (this.$itemMenu.isOpen) {
            return this.$itemMenu.select();
        }
        return this.selectSlot();
    }

    private cancel() {
        if (this.$pokemonStorageMenu.isOpen) {
            return this.$pokemonStorageMenu.close();
        } else if (this.$itemMenu.isOpen) {
            this.$pokemonStorageMenu.open(
                this.$pokemonStorageMenu.position,
                this.container
            );
            return this.$itemMenu.close();
        } else if (this.$partyTray.isOpen) {
            return this.$partyTray.close();
        }
    }

    private async selectSlot() {
        if (this.$boxCursor.hoveredSlot.gridLocation === 'party') {
            await this.$partyTray.open(() =>
                this.$boxCursor.moveToSlot(
                    this.pages[this.activePageIndex].party
                )
            );
            const slot = this.$partyTray.firstSlot;
            if (slot.pokemon) {
                await this.$preview.update(slot.pokemon.data, this.container);
            }
            return this.$boxCursor.moveToSlot(this.$partyTray.firstSlot);
        }
        const slot = this.$boxCursor.getHoveredStorageSlot();
        if (slot?.pokemon) {
            const { x, y } = slot.position;
            this.$pokemonStorageMenu.open(
                { x: x + STORAGE.ICON_WIDTH, y },
                this.container,
                { pokemon: slot.pokemon.data }
            );
        }
    }

    private async moveBoxCursor(axis: 'x' | 'y', distance: 1 | -1) {
        this.$boxCursor.moveInBox(axis, distance);
        this.$preview.clear();
        const slot = this.$boxCursor.getHoveredStorageSlot();
        if (slot?.pokemon) {
            await this.$preview.update(slot.pokemon.data, this.container);
        }
    }

    private async onPokemonMenuSelect(
        action: (typeof MENU_ITEMS.POKEMON_STORAGE)[number]
    ) {
        this.$pokemonStorageMenu.close();
        switch (action) {
            case 'WITHDRAW':
                return this.withdrawPokemon();
            case 'SUMMARY':
                const summary = new SummaryScene();
                await App.loadScene(summary);
                this.controls.pause();
                return summary.load({
                    pokemon: this.$pokemonStorageMenu.data.pokemon,
                    onClose: () => this.controls.resume(),
                });
            case 'ITEM':
                return this.$itemMenu.open(
                    this.$pokemonStorageMenu.position,
                    this.container
                );
        }
    }

    private onItemMenuSelect(action: (typeof MENU_ITEMS.ITEM)[number]) {
        switch (action) {
            case 'TAKE':
                break;
            case 'GIVE':
                break;
            case 'BACK':
                this.$pokemonStorageMenu.open(
                    this.$pokemonStorageMenu.position,
                    this.container
                );
                break;
        }
        this.$itemMenu.close();
    }

    private onPageChange(direction: 'next' | 'prev'): BoxPage {
        const activePage = this.pages[this.activePageIndex];
        const offset = direction === 'next' ? 1 : -1;
        let nextPageNum = this.activePageIndex + offset;
        let nextPage: BoxPage = this.pages[nextPageNum];
        if (nextPageNum < 0) {
            nextPage = this.pages[0];
            nextPageNum = 0;
        }
        if (nextPageNum >= this.pages.length) {
            nextPage = this.pages[this.pages.length - 1];
            nextPageNum = this.pages.length - 1;
        }
        activePage.slide(direction === 'next' ? 'left' : 'right');
        nextPage.slide(direction === 'next' ? 'right' : 'left');
        this.activePageIndex = nextPageNum;
        return nextPage;
    }

    private async withdrawPokemon() {
        if (this.$partyTray.isPartyFull) {
            return;
        }
        await this.$partyTray.addPokemon(this.$boxCursor, this.container);
        return this.$preview.clear();
    }

    private async movePartyCursor(axis: 'x' | 'y', distance: 1 | -1) {
        this.$boxCursor.moveInParty(axis, distance);
        this.$preview.clear();
        const slot = this.$boxCursor.getHoveredStorageSlot();
        if (slot?.pokemon) {
            await this.$preview.update(slot.pokemon.data, this.container);
        }
    }
}
