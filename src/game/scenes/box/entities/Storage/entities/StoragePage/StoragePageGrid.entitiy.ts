import { Pokemon } from 'pokemon-showdown/sim';
import {
  Container,
  Entity,
  IContainer,
  IState,
  State,
} from '../../../../../../../engine';
import { PokemonIcon } from '../../../../../../entities';
import { StorageCursor, StorageCursorMoveEvent } from '../StorageCursor.entity';

const width = 320;
const height = 240;
const y = 55;
const rows = 5;
const columns = 6;

type GridCell = { pokemon: Pokemon | null; index: number };

type GridRow = // dont format
  [GridCell, GridCell, GridCell, GridCell, GridCell, GridCell];

type StoragePageGridData = [
  // dont format
  GridRow,
  GridRow,
  GridRow,
  GridRow,
  GridRow
];

type StoragePageGridState = {
  data: StoragePageGridData;
};

const blankCell = () =>
  Entity.container.flex({
    width: PokemonIcon.width,
    height: PokemonIcon.height,
  });

export class StoragePageGrid extends Entity implements IContainer, IState {
  container = new Container(this);
  state: State<StoragePageGridState>;

  constructor(pagePokemon: Pokemon[]) {
    super();

    this.transform.set({ width, height, y });
    this.container.layout.grid({ rows, columns });

    this.setGridData(pagePokemon);
    console.log(this.state.data);
  }

  private setGridData(pagePokemon: Pokemon[]) {
    const grid: GridRow[] = [];
    const children: Entity[] = [];

    for (let row = 0; row < rows; row++) {
      const startIndex = row * columns;
      const endIndex = (row + 1) * columns;
      const rowPokemon = pagePokemon.slice(startIndex, endIndex);

      const gridRow: GridCell[] = [];
      for (let col = 0; col < columns; col++) {
        const pokemon = rowPokemon[col] ?? null;
        const index = col + startIndex;
        gridRow.push({ pokemon, index });
        children.push(pokemon ? new PokemonIcon(pokemon) : blankCell());
      }

      grid.push(gridRow as GridRow);
    }

    this.state = new State({ data: grid as StoragePageGridData });
    this.container.add(...children);
  }

  hoverPokemon(cursor: StorageCursor, event: StorageCursorMoveEvent) {
    const { direction, magnitude } = event;
    const dimension = direction === 'x' ? 'col' : 'row';
    const max = direction === 'x' ? columns : rows;
    const outerBound = magnitude === 1 ? max + 1 : 0;
    const resetPosition = magnitude === 1 ? 1 : max;

    if (cursor.state.position[dimension] + magnitude === outerBound) {
      cursor.state.position[dimension] = resetPosition;
    } else {
      cursor.state.position[dimension] += magnitude;
    }

    const { row, col } = cursor.state.position;
    const rowIndex = row - 1;
    const colIndex = col - 1;
    const { pokemon, index } = this.state.data[rowIndex][colIndex];
    const entity = this.container.children[index];
    cursor.transform.set({
      x: entity.transform.x,
      y: entity.transform.globalY - 10,
    });

    cursor.state.pokemon = pokemon;
    return pokemon;
  }
}
