import { Assets, Sprite, Texture } from 'pixi.js';
import { ContainerObject, Random } from '../../../engine';
import { PokemonSet } from '../../../../../pokemon-showdown/sim/teams';
import { PokemonIcon } from '../../../objects';
import { BoxSlot, StorageGrid, StorageRow, StorageSlot } from '../box.types';
import { ASSETS, STORAGE } from '../box.const';

export class BoxPage extends ContainerObject {
    header: BoxSlot = {
        gridLocation: 'header',
        position: {
            x: STORAGE.PAGE_X - STORAGE.PAGE_WIDTH / 2 - STORAGE.ICON_WIDTH / 2,
            y: 0, // STORAGE.PAGE_Y - STORAGE.ICON_HEIGHT / 2,
        },
    };
    grid: StorageGrid;

    async init(pokemonData: PokemonSet[]) {
        await this.initBackground();
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
                    const icon = new PokemonIcon({ position: { x, y } });
                    await icon.setPokemon(pokemon.name, this);
                    slot.pokemon = { icon, set: pokemon };
                }
                gridRow.push(slot);
            }
            grid.push(gridRow as StorageRow);
            row++;
        }
        this.grid = grid as StorageGrid;
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
