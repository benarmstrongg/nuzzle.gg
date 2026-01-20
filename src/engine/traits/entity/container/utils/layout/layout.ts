import { Entity } from '../../../../../core';
import type { Container } from '../../container';
import { applyGridLayout, GridOptions } from './grid';
import { applyFlexLayout, FlexOptions } from './flex';

export type CenterOptions = Omit<FlexOptions, 'justify' | 'align'>;

type LayoutOptions =
  | (GridOptions & { type: 'grid' })
  | (FlexOptions & { type: 'flex' });

type SizeAxis = 'x' | 'y' | 'both';

export class ContainerLayout {
  private options?: LayoutOptions;
  private sizeAxis?: SizeAxis;

  constructor(private container: Container, private entity: Entity) {}

  /**
   * TODO: this is broken
   */
  calculateSize() {
    return this.container.children.reduce(
      (size, child) => {
        const { width, height, x, y } = child.transform;

        size.width =
          this.sizeAxis === 'x' || this.sizeAxis === 'both'
            ? size.width + width + x
            : Math.max(size.width, width + x);
        size.height =
          this.sizeAxis === 'y' || this.sizeAxis === 'both'
            ? size.height + height + y
            : Math.max(size.height, height + y);

        return size;
      },
      { width: 0, height: 0 }
    );
  }

  grid(options: GridOptions) {
    this.options = { type: 'grid', ...options };
  }

  flex(options: FlexOptions) {
    this.sizeAxis = options.direction === 'column' ? 'y' : 'x';
    this.options = { type: 'flex', ...options };
  }

  center(options: CenterOptions) {
    this.options = {
      type: 'flex',
      justify: 'center',
      align: 'center',
      ...options,
    };
  }

  apply() {
    switch (this.options?.type) {
      case 'grid':
        return this.applyGrid();
      case 'flex':
        return this.applyFlex();
    }
  }

  private applyWhenReady<T>(
    type: LayoutOptions['type'],
    fn: (options: T, container: Container, entity: Entity) => void
  ) {
    if (!this.options || this.options.type !== type) {
      throw new Error(
        `Error applying ${type} layout: options is of type ${this.options?.type}`
      );
    }

    this.entity.onReady(() =>
      fn(this.options as T, this.container, this.entity)
    );
  }

  private applyGrid() {
    this.applyWhenReady('grid', applyGridLayout);
  }

  private applyFlex() {
    this.applyWhenReady('flex', applyFlexLayout);
  }
}
