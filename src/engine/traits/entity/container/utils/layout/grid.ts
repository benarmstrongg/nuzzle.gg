import { Entity } from '../../../../../core';
import { Container } from '../../container';

export type GridOptions = {
  rows: number;
  columns: number;
  gutter?: number;
  gap?: number;
};

export const applyGridLayout = (
  options: GridOptions,
  container: Container,
  entity: Entity
) => {
  const { columns, rows, gutter } = options;
  const start = gutter ?? 0;
  const { width, height } = entity.transform;
  const { children } = container;

  const colSpacing = Math.floor(width / columns);
  const rowSpace = Math.floor(height / rows);

  children.forEach((child, i) => {
    if (i === 0) {
      return child.transform.set({ x: start, y: start });
    }

    const { x: prevX, y: prevY } = children[i - 1].transform;

    if (i % columns === 0) {
      return child.transform.set({ x: start, y: prevY + rowGap });
    }

    child.transform.set({ x: prevX + colGap, y: prevY });
  });
};
