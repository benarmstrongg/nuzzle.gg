import { Battle, toID } from '@pkmn/sim';
import { Box } from './game/scenes/box/Box.scene';
import { game } from './engine';
import { teamGenWorker } from './game/workers';
import { Overworld } from './game/scenes/overworld/Overworld.scene';

game.fonts.add([
  { alias: 'PowerGreen', src: 'fonts/power-green.ttf' },
  {
    alias: 'PowerClearBold',
    src: 'fonts/power-clear-bold.ttf',
  },
]);

game.settings.set({ defaultFont: 'PowerGreen' });

async function box() {
  await game.init();
  // const sets = battle.p1.pokemon.map((p) => p.set);
  // await App.loadScene(new BattleScene(sets, teamGen.getTeam()));
  teamGenWorker.generateTeam(12).then(async (team) => {
    const battle = new Battle({
      formatid: toID('gen9ubers'),
      p1: {
        name: 'ben',
        team,
      },
    });
    const box = new Box(battle.p1.pokemon);
    await game.loadScene(box);
  });
}

async function overworld() {
  await game.init();
  const overworld = new Overworld();
  await game.loadScene(overworld);
}

overworld();

document
  .getElementById('debug-overworld')
  ?.addEventListener('click', overworld);
document.getElementById('debug-box')?.addEventListener('click', box);
