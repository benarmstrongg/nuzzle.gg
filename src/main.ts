import { Box } from './scenes/box/box.scene';
import { App } from './engine/app';
import TeamGenerator from '../../pokemon-showdown/data/mods/base/cg-teams';
import { Battle, PRNG, toID } from '../../pokemon-showdown/sim';
import { TypeIcon } from './objects';
import { Assets } from 'pixi.js';
import { CategoryIcon } from './objects/category-icon.obj';

async function main() {
    await loadFonts();
    await loadAssets();
    const teamGen = new TeamGenerator(
        toID('gen9randombattle'),
        PRNG.generateSeed()
    );
    teamGen.teamSize = 10;
    const battle = new Battle({
        formatid: toID('gen9randombattle'),
        p1: { name: 'ben', team: teamGen.getTeam() },
    });
    const box = new Box([...battle.p1.pokemon]);
    await App.init();
    await App.loadScene(box);
}

async function loadFonts() {
    Assets.addBundle('fonts', [
        { alias: 'PowerGreen', src: 'assets/fonts/power-green.ttf' },
        {
            alias: 'PowerClearBold',
            src: 'assets/fonts/power-clear-bold.ttf',
        },
    ]);
    await Assets.loadBundle('fonts');
}

async function loadAssets() {
    await TypeIcon.loadSpritesheet();
    await CategoryIcon.loadSpritesheet();
}

main();
