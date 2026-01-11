export type SpriteScaleMode = 'nearest' | 'linear';

export type SpritesheetFrame = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type SpritesheetOptions<TFrame extends string> = {
  frames: Record<TFrame, SpritesheetFrame>;
  initialFrame?: TFrame;
  w: number;
  h: number;
  scaleMode?: SpriteScaleMode;
};
