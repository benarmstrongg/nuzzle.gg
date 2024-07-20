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
