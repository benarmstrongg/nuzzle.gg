import { Text as PixiText, TextStyleOptions } from 'pixi.js';
import { IState, State } from '../../../traits';
import { game } from '../../game';
import { FontSize } from '../../fonts';
import { Entity } from '../entity';

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
    this.entity.ready = false;
    const style = this.getStyles(options);
    this.inner = new PixiText({ text: value, style });
    entity['inner'] = this.inner;
    this.state.set({ value });
    this.entity.transform.width = this.inner.width;
    this.entity.transform.height = this.inner.height;
    this.entity.ready = true;
  }

  private getStyles(options?: TextOptions) {
    const { size, font, lineHeight, color, wrap } = options ?? {};
    const fontFamily = font ?? game.settings.defaultFont ?? 'sans-serif';
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
