import { Entity } from '../../../../../core';
import { Container } from '../../container';

export type GridOptions = {
  rows: number;
  columns: number;
  gutter?: number;
  gutterX?: number;
  gutterY?: number;
  gap?: number;
  gapX?: number;
  gapY?: number;
};

class GridLayout {
  constructor(
    private options: GridOptions,
    private container: Container,
    private entity: Entity
  ) {}

  private get gutter(): { x: number; y: number } {
    const { gutter, gutterX, gutterY } = this.options;

    return {
      x: gutter ?? gutterX ?? 0,
      y: gutter ?? gutterY ?? 0,
    };
  }

  private get gap(): { x: number; y: number } {
    const { gap, gapX, gapY } = this.options;

    return {
      x: gap ?? gapX ?? 0,
      y: gap ?? gapY ?? 0,
    };
  }

  applyGridLayout() {
    const { columns, rows } = this.options;
    const { children } = this.container;
    const { width, height } = this.entity.transform;
    const gutter = this.gutter;
    const gap = this.gap;

    // Calculate available space after accounting for gutters
    const availableWidth = width - gutter.x * 2;
    const availableHeight = height - gutter.y * 2;

    // Calculate cell size accounting for gaps between cells
    const totalGapX = gap.x * (columns - 1);
    const totalGapY = gap.y * (rows - 1);
    const cellWidth = (availableWidth - totalGapX) / columns;
    const cellHeight = (availableHeight - totalGapY) / rows;

    children.forEach((child, i) => {
      // Calculate grid position (row, column)
      const row = Math.floor(i / columns);
      const col = i % columns;

      // Calculate position within the grid
      const x = gutter.x + col * (cellWidth + gap.x);
      const y = gutter.y + row * (cellHeight + gap.y);

      child.transform.set({ x, y });
    });
  }
}

export const applyGridLayout = (
  options: GridOptions,
  container: Container,
  entity: Entity
) => new GridLayout(options, container, entity).applyGridLayout();
