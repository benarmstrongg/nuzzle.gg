import { Pokemon } from '../../../../pokemon-showdown/sim';
import type { PokemonIcon } from '../../objects';
import type { Coordinate } from '../../engine';

type StorageGridCoordinate = { row: number; col: number } | 'header';

export type BoxSlot = {
    position: Coordinate;
    gridLocation: StorageGridCoordinate;
};

export type StorageSlot = Omit<BoxSlot, 'gridLocation'> & {
    // position: Coordinate;
    pokemon: {
        icon: PokemonIcon;
        data: Pokemon;
    } | null;
    gridLocation: Exclude<StorageGridCoordinate, 'header'>;
};
export type StorageRow = [
    StorageSlot,
    StorageSlot,
    StorageSlot,
    StorageSlot,
    StorageSlot,
    StorageSlot
];
export type StorageGrid = [
    StorageRow,
    StorageRow,
    StorageRow,
    StorageRow,
    StorageRow
];
