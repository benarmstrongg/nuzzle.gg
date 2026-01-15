export type SpriteScaleMode = 'nearest' | 'linear';

export type SpritesheetFrame = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type SpriteAnimationFrame<TFrame extends string> = {
  frame: TFrame;
  duration: number;
};

export type SpriteAnimationOptions<TFrame extends string> = {
  frames: SpriteAnimationFrame<TFrame>[];
  repeat?: boolean;
  returnToFrame?: TFrame;
};

export type SpritesheetOptions<
  TFrame extends string,
  TAnimation extends string
> = {
  frames: Record<TFrame, SpritesheetFrame>;
  defaultFrame: TFrame;
  w: number;
  h: number;
  scaleMode?: SpriteScaleMode;
  animations?: Record<TAnimation, SpriteAnimationOptions<TFrame>>;
};
