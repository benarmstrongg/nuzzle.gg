import { Entity } from '../../../core';
import { FontSize } from '../../../core/fonts';
import { IText, Text, TextOptions } from './text';

type TextSizeFactory = (
  value: string,
  options?: Omit<TextOptions, 'size'>
) => Entity & IText;

type TextFactory = ((value: string, options?: TextOptions) => Entity & IText) &
  Record<Exclude<FontSize, number>, TextSizeFactory>;

export const textFactory: TextFactory = (value, options) => {
  return new (class extends Entity implements IText {
    text = new Text(this, value, options);
  })();
};

const textSizeFactory =
  (size: Exclude<FontSize, number>): TextSizeFactory =>
  (value, options) => {
    return new (class extends Entity implements IText {
      text = new Text(this, value, { size, ...options });
    })();
  };

textFactory.xxs = textSizeFactory('xxs');
textFactory.xs = textSizeFactory('xs');
textFactory.sm = textSizeFactory('sm');
textFactory.md = textSizeFactory('md');
textFactory.lg = textSizeFactory('lg');
textFactory.xl = textSizeFactory('xl');
textFactory.xxl = textSizeFactory('xxl');
textFactory.heading = textSizeFactory('heading');
