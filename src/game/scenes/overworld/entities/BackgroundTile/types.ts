export type BackgroundTileId = 'light_grass'; // etc

export type BackgroundTileFrame =
  | 'circle'
  | 'intersection'
  | 'top_left'
  | 'top_center'
  | 'top_right'
  | 'center_left'
  | 'center_center'
  | 'center_right'
  | 'bottom_left'
  | 'bottom_center'
  | 'bottom_right';
//| 'special';

export type BackgroundTileMetadata = {
  tile: BackgroundTileId;
  frame: BackgroundTileFrame;
};
