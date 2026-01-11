import { wrap } from 'comlink';
import TeamGenWorker from './team-gen.worker?worker';

export const teamGenWorker = wrap<typeof import('./team-gen.worker')>(
  new TeamGenWorker({ name: 'teamGenWorker' })
);
