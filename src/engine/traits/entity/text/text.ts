import { Text as PixiText, TextStyleOptions } from 'pixi.js';
import { game, type Entity } from '../../../core';
import { IState, State } from '../../meta/state';
import { FontSize } from '../../../core/fonts';

export type TextOptions = {
  size?: FontSize;
  font?: string;
  wrap?: boolean;
  color?: string;
  lineHeight?: number;
};

export class Text implements IState {
  private inner: PixiText;
  state = new State({ value: '' });

  constructor(private entity: Entity, value: string, options?: TextOptions) {
    this.entity.meta.ready = false;
    const style = this.getStyles(options);
    this.inner = new PixiText({ text: value, style });
    entity['inner'] = this.inner;
    this.state.set({ value });
    this.entity.transform.width = this.inner.width;
    this.entity.transform.height = this.inner.height;
    this.entity.meta.ready = true;
  }

  private getStyles(options?: TextOptions) {
    const { size, font, lineHeight, color, wrap } = options ?? {};
    const fontFamily = font ?? game.settings.defaultFont;
    const styles: TextStyleOptions = {
      fontFamily,
    };

    const fontSize = typeof size === 'string' ? game.fonts.sizeMap[size] : size;
    if (typeof fontSize === 'number') styles.fontSize = fontSize;

    if (typeof lineHeight === 'number') styles.lineHeight = lineHeight;

    if (color) styles.fill = color;

    if (wrap) styles.wordWrap = wrap;

    return styles;
  }
}

export interface IText {
  text: Text;
}
