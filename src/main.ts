import { App } from './engine/app';
import TeamGenerator from '../../pokemon-showdown/data/mods/base/cg-teams';
import { Battle, PRNG, toID } from '../../pokemon-showdown/sim';
import { Assets } from 'pixi.js';
import { BoxScene } from './scenes/box/box.scene';

async function main() {
    await loadFonts();
    const teamGen = new TeamGenerator(toID('gen9ubers'), PRNG.generateSeed());
    teamGen.teamSize = 10;
    const battle = new Battle({
        formatid: toID('gen9ubers'),
        p1: { name: 'ben', team: teamGen.getTeam() },
    });
    const box = new BoxScene(battle.p1.pokemon);
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

main();
