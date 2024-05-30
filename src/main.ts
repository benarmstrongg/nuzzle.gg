import { Box } from './scenes/box/box.scene';
import { App } from './engine/app';
import TeamGenerator from '../../pokemon-showdown/data/mods/base/cg-teams';
import { PRNG, toID } from '../../pokemon-showdown/sim';

async function main() {
    const teamGen = new TeamGenerator(
        toID('gen9randombattle'),
        PRNG.generateSeed()
    );
    teamGen.teamSize = 10;
    const box = new Box([...teamGen.getTeam()]);
    await App.init();
    await App.loadScene(box);
}

main();