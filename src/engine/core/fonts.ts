import { Assets } from 'pixi.js';

type Font = {
  alias: string;
  src: string;
};

export type FontSize =
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'heading';

export class Fonts {
  private fonts: Font[] = [];
  sizeMap: Record<FontSize, number> = {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 22,
    heading: 24,
  };

  add(fonts: Font[]) {
    this.fonts.push(...fonts);
  }

  async load() {
    Assets.addBundle('fonts', this.fonts);
    await Assets.loadBundle('fonts');
  }
}
