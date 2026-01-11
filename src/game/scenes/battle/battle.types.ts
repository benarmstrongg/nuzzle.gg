import { TextObject, SpriteObject } from '../../../engine';
import { PokemonSprite, HpBar, StatusIcon } from '../../entities';
import { BattleButton } from './objects/button.obj';

export type SideSections = {
  pokemon: PokemonSprite;
  hp: HpBar;
  hpLabel: TextObject;
  nickname: TextObject;
  levelLabel: SpriteObject;
  level: TextObject;
  status: StatusIcon;
};

export type Side = 'user' | 'foe';

export type SideData = { side: Side };

export type OverlayButtonsData<TButton extends BattleButton> = {
  hoveredButton: TButton;
};
