import { Dex } from '../../../pokemon-showdown/sim';

export function getPokemonAssetPath(
    pokemon: string,
    type: 'front' | 'back' | 'icon'
): string {
    const { num, forme } = Dex.species.get(pokemon);
    const slug = forme ? `${num}-${forme.toLowerCase()}` : num.toString();
    if (type === 'icon') {
        return `assets/sprites/pokemon/versions/generation-viii/icons/${slug}.png`;
    }
    return type === 'back'
        ? `assets/sprites/pokemon/back/${slug}.png`
        : `assets/sprites/pokemon/${slug}.png`;
}
