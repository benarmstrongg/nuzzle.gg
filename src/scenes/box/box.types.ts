import { PokemonSet } from '../../../../pokemon-showdown/sim/teams';
import { GameObject } from '../../engine/game-object';
import type { Coordinate } from '../../engine/types';
import type { PokemonIcon } from '../../objects/pokemon-icon.obj';

type StorageGridCoordinate = { row: number; col: number } | 'header';

export type BoxSlot = {
    position: Coordinate;
    gridLocation: StorageGridCoordinate;
};

export type StorageSlot = Omit<BoxSlot, 'gridLocation'> & {
    // position: Coordinate;
    pokemon: {
        icon: Awaited<ReturnType<typeof PokemonIcon>>;
        set: PokemonSet;
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

export type BoxPage = GameObject<{ grid: StorageGrid }>;
