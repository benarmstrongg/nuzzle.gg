import { App } from './engine/app';
import TeamGenerator from '../../pokemon-showdown/data/mods/base/cg-teams';
import { Battle, PRNG, toID } from '../../pokemon-showdown/sim';
import { Assets } from 'pixi.js';
import { BoxScene } from './scenes/box/box.scene';
import { BattleScene } from './scenes/battle/battle.scene';

BoxScene;
BattleScene;

async function main() {
    await loadFonts();
    const teamGen = new TeamGenerator(toID('gen9ubers'), PRNG.generateSeed());
    teamGen.teamSize = 10;
    const battle = new Battle({
        formatid: toID('gen9ubers'),
        p1: { name: 'ben', team: teamGen.getTeam() },
    });
    await App.init();
    const sets = battle.p1.pokemon.map((p) => p.set);
    await App.loadScene(new BattleScene(sets, teamGen.getTeam()));
    // await App.loadScene(new BoxScene(battle.p1.pokemon));
}

async function loadFonts() {
    Assets.addBundle('fonts', [
        { alias: 'PowerGreen', src: 'fonts/power-green.ttf' },
        {
            alias: 'PowerClearBold',
            src: 'fonts/power-clear-bold.ttf',
        },
    ]);
    await Assets.loadBundle('fonts');
}

main();
