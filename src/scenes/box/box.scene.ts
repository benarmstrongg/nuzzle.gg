import { Assets, Sprite, Text } from 'pixi.js';
import { OnInit, Scene, ContainerObject, Controls } from '../../engine';
import { PokemonSet } from '../../../../pokemon-showdown/sim/teams';
import { font } from '../../util/font.util';
import { ASSETS, STORAGE, REQUIRED_ASSETS, BUTTONS } from './box.const';
import { StorageSlot } from './box.types';

import { BoxCursor } from './objects/cursor.obj';
import { BoxPage } from './objects/page.obj';
import { BoxPreview } from './objects/preview.obj';

export class Box extends Scene implements OnInit {
    private $cursor: BoxCursor = new BoxCursor();
    private pages: BoxPage[] = [];
    private activePageIndex = 0;
    private $preview = new BoxPreview();
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
    // private $pokemonMenu = new ContainerObject({
    //     sections: {
    //         bg: new GameObject(),
    //         cursor: new GameObject(),
    //         options: new ContainerObject({
    //             sections: {
    //                 move: new Text({
    //                     style: font('medium'),
    //                 }),
    //                 summary: new Text({
    //                     style: font('medium'),
    //                     text: 'SUMMARY',
    //                 }),
    //                 item: new Text({
    //                     style: font('medium'),
    //                     text: 'ITEM',
    //                 }),
    //                 back: new Text({
    //                     style: font('medium'),
    //                     text: 'BACK',
    //                 }),
    //             },
    //         }),
    //     },
    // });

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
        Controls.selected.on('a', () => {});
    }

    async render(): Promise<ContainerObject> {
        const scene = new ContainerObject({
            children: [
                Sprite.from(ASSETS.BG),
                Sprite.from(ASSETS.MAIN_OVERLAY),
            ],
        });

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
        this.$cursor.init({
            activePage: this.pages[0],
            onPageChange: (direction) => this.onPageChange(direction),
        });
        this.$preview.init();
        scene.addChild(
            this.$cursor,
            this.$preview,
            this.$partyButton,
            this.$startButton
        );
        scene.scale.set(1.5);
        return scene;
    }

    private async moveCursor(axis: 'x' | 'y', distance: 1 | -1) {
        this.$preview.clear();
        const slot = this.$cursor.move(axis, distance) as StorageSlot;
        if (slot.pokemon) {
            await this.$preview.update(slot.pokemon.set, this.container);
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
