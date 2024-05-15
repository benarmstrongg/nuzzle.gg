import { FillStyleInputs, TextStyleOptions } from 'pixi.js';

type FontSize =
    | 'xsmall'
    | 'small'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | 'heading';
type FontWeight = 'regular' | 'bold';
type FontColor = FillStyleInputs;

const SIZE_MAP: Record<FontSize, number> = {
    xsmall: 11,
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 17,
    xxlarge: 18,
    heading: 24,
};

const FONT_MAP: Record<FontWeight, string> = {
    regular: 'PowerGreen',
    bold: 'PowerClearBold',
};

export function font(
    size: FontSize,
    weight: FontWeight = 'regular',
    color?: FontColor
): TextStyleOptions {
    const options: TextStyleOptions = {
        fontSize: SIZE_MAP[size],
        fontFamily: FONT_MAP[weight],
    };
    if (color) {
        options.fill = color;
    }
    return options;
}
