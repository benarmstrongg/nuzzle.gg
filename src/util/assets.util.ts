import { Assets, Spritesheet, SpritesheetFrameData, Texture } from 'pixi.js';
import { Dex, Pokemon } from '../../../pokemon-showdown/sim';

// export function getPokemonSpritePath(
//   pokemon: string,
//   type: PokemonSpriteType
// ): string {
//   const { num, forme } = Dex.species.get(pokemon);
//   const slug = forme ? `${num}-${forme.toLowerCase()}` : num.toString();
//   if (type === 'icon') {
//     return `sprites/pokemon/versions/generation-viii/icons/${slug}.png`;
//   }
//   return type === 'back'
//     ? `sprites/pokemon/back/${slug}.png`
//     : `sprites/pokemon/${slug}.png`;
// }

export const getPokemonSpritePaths = (pokemon: Pokemon) => {
  const { num, forme } = Dex.species.get(pokemon.species.name);
  const slug = forme ? `${num}-${forme.toLowerCase()}` : num.toString();

  return {
    front: `sprites/pokemon/${slug}.png`,
    back: `sprites/pokemon/back/${slug}.png`,
  };
};

export const getPokemonIconPath = (pokemon: Pokemon) => {
  const { num, forme } = Dex.species.get(pokemon.species.name);
  const slug = forme ? `${num}-${forme.toLowerCase()}` : num.toString();
  return `sprites/pokemon/versions/generation-viii/icons/${slug}.png`;
};

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
