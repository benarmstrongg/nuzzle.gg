import { Pokemon } from '../../../../pokemon-showdown/sim';
import type { PokemonIcon } from '../../objects';

type StorageGridCoordinate =
    | { row: number; col: number }
    | 'header'
    | 'party'
    | 'start';

export type BoxSlot = {
    position: { x: number; y: number };
    gridLocation: StorageGridCoordinate;
};

export type StorageSlot = Omit<BoxSlot, 'gridLocation'> & {
    // position: Coordinate;
    pokemon: {
        icon: PokemonIcon;
        data: Pokemon;
    } | null;
    gridLocation: Exclude<StorageGridCoordinate, 'header' | 'party' | 'start'>;
};
