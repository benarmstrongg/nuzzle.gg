import { Assets, Spritesheet, SpritesheetFrameData, Texture } from 'pixi.js';
import { Dex } from '../../../pokemon-showdown/sim';

export function getPokemonSpritePath(
    pokemon: string,
    type: 'front' | 'back' | 'icon'
): string {
    const { num, forme } = Dex.species.get(pokemon);
    const slug = forme ? `${num}-${forme.toLowerCase()}` : num.toString();
    if (type === 'icon') {
        return `sprites/pokemon/versions/generation-viii/icons/${slug}.png`;
    }
    return type === 'back'
        ? `sprites/pokemon/back/${slug}.png`
        : `sprites/pokemon/${slug}.png`;
}

export async function loadSpritesheet(
    image: string,
    frames: Record<string, SpritesheetFrameData>,
    width: number,
    height: number
): Promise<Spritesheet> {
    await Assets.load(image);
    const atlasData = {
        frames,
        meta: {
            image,
            size: { w: width, h: height },
            scale: 1,
        },
    };
    const spritesheet = new Spritesheet(Texture.from(image), atlasData);
    await spritesheet.parse();
    return spritesheet;
}
