import { PokemonId, ItemId } from '../../../../types';

export type MapData = {
  dimensions: { l: number; w: number };
  tiles: MapTileData[][];
};

export type TileId = 'grass' | 'brown-grass' | 'etc';

export type MapTileData =
  | { type: 'none'; item?: MapItemData }
  | {
      type: 'grass';
      tile: TileId;
      encounters: MapEncounterData[];
      item?: MapItemData;
    };

export type MapEncounterData = { pokemon: PokemonId; rate: number };

export type MapItemData = {
  item: ItemId | 'random';
  quantity?: number;
  hidden?: boolean;
};
