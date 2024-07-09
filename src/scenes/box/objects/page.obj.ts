import { Assets, Sprite, Texture } from 'pixi.js';
import { ContainerObject, Random } from '../../../engine';
import { Pokemon } from '../../../../../pokemon-showdown/sim';
import { PokemonIcon } from '../../../objects';
import { BoxSlot, StorageSlot } from '../box.types';
import { ASSETS, BUTTONS, STORAGE } from '../box.const';

type StorageRow = [
    StorageSlot,
    StorageSlot,
    StorageSlot,
    StorageSlot,
    StorageSlot,
    StorageSlot
];

export class BoxPage extends ContainerObject {
    header: BoxSlot = {
        gridLocation: 'header',
        position: {
            x: STORAGE.PAGE_X - STORAGE.PAGE_WIDTH / 2 - STORAGE.ICON_WIDTH / 2,
            y: 0, // STORAGE.PAGE_Y - STORAGE.ICON_HEIGHT / 2,
        },
    };
    party: BoxSlot = {
        gridLocation: 'party',
        position: {
            x: BUTTONS.PARTY.POSITION.x,
            y: BUTTONS.PARTY.POSITION.y - STORAGE.ICON_HEIGHT / 2,
        },
    };
    start: BoxSlot = {
        gridLocation: 'start',
        position: {
            x: BUTTONS.START.POSITION.x,
            y: BUTTONS.START.POSITION.y - STORAGE.ICON_HEIGHT / 2,
        },
    };
    storage: [StorageRow, StorageRow, StorageRow, StorageRow, StorageRow];

    async init(pokemonData: Pokemon[]) {
        await this.initBackground();
        let storage: StorageRow[] = [];
        let row = 0;
        while (row < STORAGE.NUM_ROWS) {
            let gridRow: StorageSlot[] = [];
            for (
                let i = STORAGE.NUM_COLS * row;
                i < STORAGE.NUM_COLS * (row + 1);
                i++
            ) {
                const col = i % STORAGE.NUM_COLS;
                const pokemon = pokemonData[i];
                const x =
                    STORAGE.ICON_GAP +
                    STORAGE.PAGE_X -
                    this.width +
                    STORAGE.ICON_WIDTH * col;
                const y = STORAGE.ICON_GAP + STORAGE.ICON_HEIGHT * (row + 1);
                const slot: StorageSlot = {
                    position: { x, y },
                    gridLocation: { row, col },
                    pokemon: null,
                };
                if (pokemon) {
                    const icon = new PokemonIcon({
                        position: { x, y },
                        zIndex: 3,
                    });
                    await icon.setPokemon(pokemon.name, this);
                    slot.pokemon = { icon, data: pokemon };
                }
                gridRow.push(slot);
            }
            storage.push(gridRow as StorageRow);
            row++;
        }
        this.storage = storage as this['storage'];
    }

    private async initBackground() {
        const asset = ASSETS.PAGE_ART[Random.int(ASSETS.PAGE_ART.length)];
        await Assets.load(asset);
        const bg = new Sprite({
            texture: Texture.from(asset),
            position: { x: STORAGE.PAGE_X, y: STORAGE.PAGE_Y },
            anchor: { x: 1, y: 0 },
        });
        this.addChild(bg);
    }

    slide(_direction: 'left' | 'right') {}
}
