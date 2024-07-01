import { Assets, Sprite, Text } from 'pixi.js';
import { Pokemon } from '../../../../pokemon-showdown/sim';
import {
    OnInit,
    OnDestroy,
    Scene,
    ContainerObject,
    Controls,
    App,
} from '../../engine';
import { font } from '../../util/font.util';
import { Menu } from '../../objects';

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
import { StorageSlot } from './box.types';
import { Summary } from '../summary/summary.scene';

export class Box extends Scene implements OnInit, OnDestroy {
    private $boxCursor: BoxCursor;
    private pages: BoxPage[] = [];
    private activePageIndex = 0;
    private $preview = new BoxPreview();
    private $partyButton = new Text({
        text: BUTTONS.PARTY.TEXT,
        style: font({ size: 'heading', weight: 'bold' }),
        position: BUTTONS.PARTY.POSITION,
    });
    private $startButton = new Text({
        text: BUTTONS.START.TEXT,
        style: font({ size: 'heading', weight: 'bold' }),
        position: BUTTONS.START.POSITION,
    });
    private $pokemonMenu: Menu<typeof MENU_ITEMS.POKEMON, { pokemon: Pokemon }>;
    private $itemMenu: Menu<typeof MENU_ITEMS.ITEM>;
    private controls: Controls;

    constructor(private readonly pokemonData: Pokemon[]) {
        super();
    }

    async onInit(): Promise<void> {
        await Assets.load(REQUIRED_ASSETS);
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

    async render(): Promise<ContainerObject> {
        const scene = new ContainerObject([
            Sprite.from(ASSETS.BG),
            Sprite.from(ASSETS.MAIN_OVERLAY),
        ]);

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
            scene.addChild(page);
            pageNum++;
        }
        this.$boxCursor = await BoxCursor.init({
            activePage: this.pages[0],
            onPageChange: (direction) => this.onPageChange(direction),
            container: scene,
        });
        this.$pokemonMenu = await Menu.init({
            onSelect: (action) => this.onPokemonMenuSelect(action),
            items: MENU_ITEMS.POKEMON,
        });
        this.$itemMenu = await Menu.init({
            onSelect: (action) => this.onItemMenuSelect(action),
            items: MENU_ITEMS.ITEM,
        });
        scene.addChild(
            this.$boxCursor,
            this.$preview,
            this.$partyButton,
            this.$startButton
        );
        return scene;
    }

    private moveCursor(axis: 'x' | 'y', distance: 1 | -1) {
        if (this.$pokemonMenu.isOpen && axis === 'y') {
            return this.$pokemonMenu.moveCursor(distance);
        } else if (this.$itemMenu.isOpen && axis === 'y') {
            return this.$itemMenu.moveCursor(distance);
        }
        return this.moveBoxCursor(axis, distance);
    }

    private select() {
        if (this.$pokemonMenu.isOpen) {
            return this.$pokemonMenu.select();
        } else if (this.$itemMenu.isOpen) {
            return this.$itemMenu.select();
        }
        return this.selectPokemon();
    }

    private cancel() {
        if (this.$pokemonMenu.isOpen) {
            return this.$pokemonMenu.close();
        } else if (this.$itemMenu.isOpen) {
            this.$pokemonMenu.open(this.$pokemonMenu.position, this.container);
            return this.$itemMenu.close();
        }
    }

    private selectPokemon() {
        const slot = this.$boxCursor.getHoveredStorageSlot();
        if (slot?.pokemon) {
            const { x, y } = slot.position;
            this.$pokemonMenu.open(
                { x: x + STORAGE.ICON_WIDTH, y },
                this.container,
                { pokemon: slot.pokemon.data }
            );
        }
    }

    private async moveBoxCursor(axis: 'x' | 'y', distance: 1 | -1) {
        this.$preview.clear();
        const slot = this.$boxCursor.move(axis, distance) as StorageSlot;
        if (slot.pokemon) {
            await this.$preview.update(slot.pokemon.data, this.container);
        }
    }

    private async onPokemonMenuSelect(
        action: (typeof MENU_ITEMS.POKEMON)[number]
    ) {
        switch (action) {
            case 'MOVE':
                break;
            case 'SUMMARY':
                const summary = new Summary();
                await App.loadScene(summary);
                this.controls.pause();
                summary.load({
                    pokemon: this.$pokemonMenu.data.pokemon,
                    onClose: () => this.controls.resume(),
                });
                break;
            case 'ITEM':
                this.$itemMenu.open(this.$pokemonMenu.position, this.container);
                break;
        }
        this.$pokemonMenu.close();
    }

    private onItemMenuSelect(action: (typeof MENU_ITEMS.ITEM)[number]) {
        switch (action) {
            case 'TAKE':
                break;
            case 'GIVE':
                break;
            case 'BACK':
                this.$pokemonMenu.open(
                    this.$pokemonMenu.position,
                    this.container
                );
                return this.$itemMenu.close();
        }
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
}
