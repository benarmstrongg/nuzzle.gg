import { Assets, Texture } from 'pixi.js';
import { ContainerObject, SpriteObject } from '../../../engine';
import { BoxSlot, StorageSlot } from '../box.types';
import { ASSETS, STORAGE } from '../box.const';
import { BoxPage } from './page.obj';

type ChangePageListener = (direction: 'next' | 'prev') => BoxPage;

type BoxCursorInitOptions = {
    onPageChange: ChangePageListener;
    activePage: BoxPage;
    container: ContainerObject;
};

export class BoxCursor extends SpriteObject {
    private activePage: BoxPage;
    private onPageChange: ChangePageListener;
    hoveredSlot: BoxSlot;

    private constructor() {
        super({ texture: Texture.from(ASSETS.CURSOR_GRAB) });
    }

    static async init(options: BoxCursorInitOptions): Promise<BoxCursor> {
        await Assets.load([ASSETS.CURSOR_GRAB, ASSETS.CURSOR_FIST]);
        const cursor = new BoxCursor();
        cursor.width = 64;
        cursor.height = 64;
        cursor.activePage = options.activePage;
        cursor.position = cursor.activePage.header.position;
        cursor.hoveredSlot = cursor.activePage.header;
        cursor.onPageChange = options.onPageChange;
        return cursor;
    }

    moveCursor(axis: 'x' | 'y', distance: 1 | -1) {
        const CENTER_INDEX = 2;
        if (this.hoveredSlot.gridLocation === 'header') {
            if (axis === 'x') {
                this.activePage = this.onPageChange(
                    distance === 1 ? 'next' : 'prev'
                );
                return;
            }
            const nextSlot =
                distance === 1
                    ? this.activePage.storage[0][CENTER_INDEX]
                    : this.activePage.party;
            return this.moveToSlot(nextSlot);
        }
        if (
            this.hoveredSlot.gridLocation === 'party' ||
            this.hoveredSlot.gridLocation === 'start'
        ) {
            if (axis === 'x') {
                const nextSlot =
                    this.hoveredSlot.gridLocation === 'party'
                        ? this.activePage.start
                        : this.activePage.party;
                return this.moveToSlot(nextSlot, 2);
            }
            if (distance === 1) {
                return this.moveToSlot(this.activePage.header);
            }
            return this.moveToSlot(
                this.activePage.storage[STORAGE.NUM_ROWS - 1][CENTER_INDEX]
            );
        }
        const { row, col } = this.hoveredSlot.gridLocation;
        const nextCol = axis === 'x' ? col + distance : col;
        const nextRow = axis === 'y' ? row + distance : row;
        const nextSlot = this.activePage.storage[nextRow]?.[nextCol];
        if (!nextSlot) {
            if (axis === 'y') {
                if (distance === -1) {
                    return this.moveToSlot(this.activePage.header);
                }
                return this.moveToSlot(this.activePage.party);
            } else {
                const endCol = distance === 1 ? 0 : STORAGE.NUM_COLS - 1;
                const nextSlot = this.activePage.storage[nextRow]?.[endCol];
                return this.moveToSlot(nextSlot, 2);
            }
        }
        return this.moveToSlot(nextSlot);
    }

    getHoveredStorageSlot(): StorageSlot | null {
        if (this.hoveredSlot.gridLocation === 'header') {
            return null;
        }
        return this.hoveredSlot as StorageSlot;
    }

    moveToSlot(slot: BoxSlot, speed = 1) {
        this.hoveredSlot = slot;
        const moveOpts = {
            x: slot.position.x + STORAGE.CURSOR_OFFSET_X,
            y: slot.position.y + STORAGE.CURSOR_OFFSET_Y,
            speed,
        };
        this.transform.moveTo(moveOpts);
    }

    private changeSprite(
        sprite: 'grab' | 'fist',
        container: ContainerObject
    ): void {
        const texture = Texture.from(
            sprite === 'fist' ? ASSETS.CURSOR_FIST : ASSETS.CURSOR_GRAB
        );
        this.setTexture(texture, container);
    }

    async grabPokemon(container: ContainerObject) {
        const slot = this.getHoveredStorageSlot();
        if (slot?.pokemon) {
            this.changeSprite('fist', container);
            const cursorPos = { x: this.position.x, y: this.position.y };
            await this.transform.moveTo({
                x: slot.position.x,
                y: slot.position.y,
            });
            await this.transform.moveTo(cursorPos);
            await slot.pokemon.icon.transform.moveTo({
                x: cursorPos.x,
                y: cursorPos.y + 5,
            });
        }
    }

    releasePokemon(container: ContainerObject) {
        this.changeSprite('grab', container);
    }
}
