import { expose } from 'comlink';
import { TeamGenerators } from '@pkmn/randoms';

const teamGeneratorSize = 6;

export const generateTeam = (teamSize = 6) => {
  const numIterations = Math.ceil(teamSize / teamGeneratorSize);
  const teamGen = TeamGenerators.getTeamGenerator('gen9randombattle');

  return Array.from({ length: numIterations }, () => teamGen.getTeam()).flat();
};

expose({ generateTeam });
