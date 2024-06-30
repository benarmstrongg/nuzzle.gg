import { Pokemon } from '../../../../pokemon-showdown/sim';
import { ContainerObject } from '../../engine';

export interface SummaryPage {
    setData(pokemon: Pokemon, container: ContainerObject): void;
}
