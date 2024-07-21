import { Texture } from 'pixi.js';
import {
    App,
    ContainerObject,
    SpriteObject,
    TextObject,
} from '../../../engine';
import { ASSETS, PARTY_TRAY } from '../box.const';
import { StorageSlot } from '../box.types';
import { BoxCursor } from './cursor.obj';
import { font } from '../../../util/font.util';

type StorageRow = [StorageSlot, StorageSlot];

export class BoxPartyTray extends ContainerObject {
    private $tray = new SpriteObject({
        zIndex: 2,
    });
    private $startButton = new TextObject({
        text: 'START',
        style: font({ size: 'heading', weight: 'bold' }),
        position: PARTY_TRAY.START_BUTTON_POSITION,
    });
    private onClose: () => void = () => {};
    storage: [StorageRow, StorageRow, StorageRow];

    constructor() {
        super({
            position: PARTY_TRAY.CLOSED_POSITION,
            zIndex: 3,
            visible: false,
        });
        this.addChild(this.$tray, this.$startButton);
    }

    get isOpen(): boolean {
        return this.visible;
    }

    get isPartyFull(): boolean {
        return this.storage.flat().every((slot) => slot.pokemon);
    }

    get firstSlot(): StorageSlot {
        return this.storage[0][0];
    }

    init() {
        this.$tray.setTexture(Texture.from(ASSETS.PARTY_OVERLAY), this);
        this.storage = [[], [], []] as unknown as this['storage'];
        for (const row of [1, 2, 3]) {
            for (const col of [1, 2]) {
                const gridLocation = { row, col };
                this.storage[row - 1][col - 1] = {
                    gridLocation,
                    position: this.getSlotPosition('global', gridLocation),
                    pokemon: null,
                };
            }
        }
    }

    async open(onClose: () => void) {
        this.onClose = onClose;
        this.visible = true;
        await this.transform.moveTo({
            ...PARTY_TRAY.OPEN_POSITION,
            speed: 2.5,
        });
    }

    async close() {
        await this.transform.moveTo({
            ...PARTY_TRAY.CLOSED_POSITION,
            speed: 2.5,
        });
        this.visible = false;
        this.onClose();
    }

    private getSlotPosition(
        type: 'local' | 'global',
        gridLocation: StorageSlot['gridLocation']
    ): {
        x: number;
        y: number;
    } {
        const { row, col } = gridLocation;
        const offsetY = col % 2 === 0 ? 10 : 0;
        if (type === 'local') {
            return {
                x:
                    PARTY_TRAY.FIRST_SLOT_LOCAL_POSITION.x +
                    (col - 1) * PARTY_TRAY.COL_GAP,
                y:
                    PARTY_TRAY.FIRST_SLOT_LOCAL_POSITION.y +
                    (row - 1) * PARTY_TRAY.ROW_GAP +
                    offsetY,
            };
        }
        return {
            x:
                PARTY_TRAY.FIRST_SLOT_GLOBAL_POSITION.x +
                (col - 1) * PARTY_TRAY.COL_GAP,
            y:
                PARTY_TRAY.FIRST_SLOT_GLOBAL_POSITION.y +
                (row - 1) * PARTY_TRAY.ROW_GAP +
                offsetY,
        };
    }

    async addPokemon(cursor: BoxCursor, container: ContainerObject) {
        const firstOpenSlot = this.storage.flat().find((slot) => !slot.pokemon);
        const storageSlot = cursor.getHoveredStorageSlot();
        if (!firstOpenSlot || !storageSlot?.pokemon) {
            return;
        }
        await cursor.grabPokemon(container);
        firstOpenSlot.pokemon = storageSlot.pokemon;
        await this.open(() => {});
        await App.wait(50);
        await Promise.all([
            storageSlot.pokemon.icon.transform.moveTo(firstOpenSlot.position),
            cursor.moveToSlot(firstOpenSlot),
        ]);
        firstOpenSlot.pokemon.icon.render(this);
        firstOpenSlot.pokemon.icon.position = this.getSlotPosition(
            'local',
            firstOpenSlot.gridLocation
        );
        await App.wait(100);
        await Promise.all([this.close(), cursor.moveToSlot(storageSlot, 2)]);
        cursor.dropPokemon(container);
        storageSlot.pokemon = null;
    }
}
