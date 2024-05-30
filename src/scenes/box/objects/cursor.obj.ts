import { Texture } from 'pixi.js';
import { GameObject } from '../../../engine';
import { BoxSlot, StorageSlot } from '../box.types';
import { ASSETS, STORAGE } from '../box.const';
import { BoxPage } from './page.obj';

type ChangePageListener = (direction: 'next' | 'prev') => BoxPage;

type BoxCursorInitOptions = {
    onPageChange: ChangePageListener;
    activePage: BoxPage;
};

export class BoxCursor extends GameObject {
    private activePage: BoxPage;
    private onPageChange: ChangePageListener;
    hoveredSlot: BoxSlot;

    constructor() {
        super({ texture: Texture.from(ASSETS.CURSOR_GRAB) });
    }

    init(options: BoxCursorInitOptions) {
        this.width = 64;
        this.height = 64;
        this.activePage = options.activePage;
        this.position = this.activePage.header.position;
        this.hoveredSlot = this.activePage.header;
        this.onPageChange = options.onPageChange;
    }

    move(axis: 'x' | 'y', distance: 1 | -1): BoxSlot {
        if (this.hoveredSlot.gridLocation === 'header') {
            if (axis === 'x') {
                this.activePage = this.onPageChange(
                    distance === 1 ? 'next' : 'prev'
                );
                return this.activePage.header;
            }
            const nextRow = distance === 1 ? 0 : STORAGE.NUM_ROWS - 1;
            const nextSlot = this.activePage.grid[nextRow][2];
            return this.moveToSlot(nextSlot);
        }
        const { row, col } = this.hoveredSlot.gridLocation;
        const nextCol = axis === 'x' ? col + distance : col;
        const nextRow = axis === 'y' ? row + distance : row;
        const nextSlot = this.activePage.grid[nextRow]?.[nextCol];
        if (!nextSlot) {
            if (axis === 'y') {
                this.hoveredSlot.gridLocation = 'header';
                this.moveTo(this.activePage.header.position);
                return this.activePage.header;
            } else {
                const endCol = distance === 1 ? 0 : STORAGE.NUM_COLS - 1;
                const nextSlot = this.activePage.grid[nextRow]?.[endCol];
                return this.moveToSlot(nextSlot, 2);
            }
        }
        return this.moveToSlot(nextSlot);
    }

    private moveToSlot(slot: StorageSlot, speed = 1): BoxSlot {
        this.hoveredSlot = slot;
        this.moveTo({
            x: slot.position.x + STORAGE.CURSOR_OFFSET_X,
            y: slot.position.y + STORAGE.CURSOR_OFFSET_Y,
            speed,
        });
        return slot;
    }
}
