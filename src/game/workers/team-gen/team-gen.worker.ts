import { expose } from 'comlink';
import { TeamGenerators } from '@pkmn/randoms';

export const generateTeam = (_teamSize = 6) => {
  const teamGen = TeamGenerators.getTeamGenerator('gen9randombattle');

  return teamGen.getTeam();
};

expose({ generateTeam });
