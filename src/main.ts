import { Battle, toID } from 'pokemon-showdown/sim';
import { Box } from './scenes/box/Box.scene';
import { game } from './engine';
import { teamGenWorker } from './workers';

game.fonts.add([
  { alias: 'PowerGreen', src: 'fonts/power-green.ttf' },
  {
    alias: 'PowerClearBold',
    src: 'fonts/power-clear-bold.ttf',
  },
]);

game.settings.set({ defaultFont: 'PowerGreen' });

async function main() {
  await game.init();
  // const sets = battle.p1.pokemon.map((p) => p.set);
  // await App.loadScene(new BattleScene(sets, teamGen.getTeam()));
  teamGenWorker.generateTeam(12).then(async (team) => {
    console.log('done', team);
    const battle = new Battle({
      formatid: toID('gen9ubers'),
      p1: {
        name: 'ben',
        team,
      },
    });
    const box = new Box(battle.p1.pokemon);
    console.log(box);
    await game.loadScene(box);
  });
}

main();
