import { Array2d } from '../../../../../engine';
import { PokemonId, ItemId } from '../../../../types';
import { BackgroundTileMetadata } from '../BackgroundTile/types';
import { TileId } from '../Tile';

export type WorldData = {
  dimensions: { l: number; w: number };
  tiles: Array2d<WorldTileMetadata>;
  backgroundTiles: Array2d<BackgroundTileMetadata>;
};

export type WorldTileMetadata =
  | { type: 'none'; item?: TileItemData }
  | {
      type: 'grass';
      tile: TileId;
      encounters: TileEncounterData[];
      item?: TileItemData;
    };

export type TileEncounterData = { pokemon: PokemonId; rate: number };

export type TileItemData = {
  item: ItemId | 'random';
  quantity?: number;
  hidden?: boolean;
};
