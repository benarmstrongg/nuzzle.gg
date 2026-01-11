import { Entity } from '../../../../../core';
import { Container } from '../../container';

type FlexJustify = 'start' | 'center' | 'space-between';
type FlexAlign = 'start' | 'center' | 'end';

export type FlexOptions = {
  direction?: 'row' | 'column';
  justify?: FlexJustify;
  align?: FlexAlign;
  gap?: number;
  gutter?: number;
  gutterX?: number;
  gutterY?: number;
};

type FlexPositionFn = (data: { child: Entity; lastChild?: Entity }) => number;

class FlexLayout {
  private occupiedSpace = 0;

  constructor(
    private options: FlexOptions,
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

  applyFlexLayout() {
    const {
      direction = 'row',
      justify = 'start',
      align = 'start',
    } = this.options;
    const { children } = this.container;
    const justifyAxis = direction === 'row' ? 'x' : 'y';
    const justifyDimension = direction === 'row' ? 'width' : 'height';
    const alignAxis = direction === 'row' ? 'y' : 'x';
    const alignFn = this.alignFnMap[align];
    const justifyFn = this.justifyFnMap[justify];

    this.occupiedSpace = this.container.children.reduce(
      (total, child) => total + child.transform[justifyDimension],
      0
    );

    children.forEach((child, i) => {
      const lastChild = children[i - 1];
      child.transform[alignAxis] = alignFn({ child, lastChild });
      child.transform[justifyAxis] = justifyFn({ child, lastChild });
    });
  }

  private alignStart: FlexPositionFn = () => {
    const { direction = 'row' } = this.options;
    const axis = direction === 'row' ? 'y' : 'x';
    return this.gutter[axis];
  };

  private alignCenter: FlexPositionFn = ({ child }) => {
    const center = this.entity.transform.height / 2;
    return center - child.transform.height / 2;
  };

  private alignEnd: FlexPositionFn = ({ child }) => {
    const { direction = 'row' } = this.options;
    const axis = direction === 'row' ? 'y' : 'x';
    return (
      this.entity.transform.height - child.transform.height - this.gutter[axis]
    );
  };

  private justifyStart: FlexPositionFn = ({ lastChild }) => {
    const { direction = 'row', gap = 0 } = this.options;
    const axis = direction === 'row' ? 'x' : 'y';

    if (!lastChild) {
      return this.gutter[axis];
    }

    const dimension = direction === 'row' ? 'width' : 'height';
    return lastChild.transform[dimension] + lastChild.transform[axis] + gap;
  };

  private justifyCenter: FlexPositionFn = ({ lastChild }) => {
    const { direction = 'row', gap = 0 } = this.options;
    const dimension = direction === 'row' ? 'width' : 'height';
    const axisSize = this.entity.transform[dimension];
    const freeSpace = axisSize - this.occupiedSpace;

    if (!lastChild) {
      return freeSpace / 2;
    }

    const axis = direction === 'row' ? 'x' : 'y';
    return lastChild.transform[axis] + lastChild.transform[dimension] + gap;
  };

  private justifySpaceBetween: FlexPositionFn = ({ child, lastChild }) => {
    const { direction = 'row' } = this.options;
    const axis = direction === 'row' ? 'x' : 'y';

    if (!lastChild) {
      return this.gutter[axis];
    }

    const dimension = direction === 'row' ? 'width' : 'height';
    const axisSize = this.entity.transform[dimension];

    const freeSpace = axisSize - this.occupiedSpace;
    const gapCount = this.container.children.length - 1 || 1;
    const spaceSize = freeSpace / gapCount;

    return (
      lastChild.transform[axis] +
      lastChild.transform[dimension] +
      spaceSize -
      child.transform[dimension] / 2
    );
  };

  private alignFnMap: Record<FlexAlign, FlexPositionFn> = {
    start: this.alignStart,
    center: this.alignCenter,
    end: this.alignEnd,
  };
  private justifyFnMap: Record<FlexJustify, FlexPositionFn> = {
    start: this.justifyStart,
    center: this.justifyCenter,
    'space-between': this.justifySpaceBetween,
  };
}

export const applyFlexLayout = (
  options: FlexOptions,
  container: Container,
  entity: Entity
) => new FlexLayout(options, container, entity).applyFlexLayout();
