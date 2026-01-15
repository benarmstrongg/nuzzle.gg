export type CharacterId = 'red';

export type CharacterFrame =
  | 'idle_down'
  | 'idle_left'
  | 'idle_right'
  | 'idle_up'
  | 'walk_down_1'
  | 'walk_down_2'
  | 'walk_down_3'
  | 'walk_left_1'
  | 'walk_left_2'
  | 'walk_left_3'
  | 'walk_right_1'
  | 'walk_right_2'
  | 'walk_right_3'
  | 'walk_up_1'
  | 'walk_up_2'
  | 'walk_up_3';

export type CharacterAnimation =
  | 'idle_down'
  | 'idle_left'
  | 'idle_right'
  | 'idle_up'
  | 'walk_down'
  | 'walk_left'
  | 'walk_right'
  | 'walk_up';

export type CharacterDirection = 'down' | 'left' | 'right' | 'up';
