import { Box } from './scenes/box/box.scene';
import { App } from './engine/app';
import TeamGenerator from '../../pokemon-showdown/data/mods/base/cg-teams';
import { Battle, PRNG, toID } from '../../pokemon-showdown/sim';

async function main() {
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

main();
