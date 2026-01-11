import { expose } from 'comlink';
import TeamGenerator from 'pokemon-showdown/data/mods/base/cg-teams';
import { PRNG, toID } from 'pokemon-showdown/sim';

export const generateTeam = (teamSize = 6) => {
  const teamGen = new TeamGenerator(toID('gen9ubers'), PRNG.generateSeed());
  teamGen.teamSize = teamSize;

  return teamGen.getTeam();
};

expose({ generateTeam });
