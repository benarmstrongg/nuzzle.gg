import type { CenterOptions, FlexOptions, GridOptions } from './utils';
import { Container, MaybeEntity } from './container';
import { TransformState } from '../../transform';
import { Entity } from "../entity";

type ContainerFactory = ((
  ...children: MaybeEntity[]
) => Entity.Container) & {
  box: (
    options: Partial<TransformState>,
    ...children: MaybeEntity[]
  ) => Entity.Container;
  flex: (
    options: FlexOptions & Partial<TransformState>,
    ...children: MaybeEntity[]
  ) => Entity.Container;
  grid: (
    options: GridOptions & Partial<TransformState>,
    ...children: MaybeEntity[]
  ) => Entity.Container;
  center: (
    options: CenterOptions & Partial<TransformState>,
    ...children: MaybeEntity[]
  ) => Entity.Container;
};

export const containerFactory: ContainerFactory = (...children) => {
  return new (class extends Entity.Container {
    container = new Container(this, ...children);
  })();
};

containerFactory.box = (options, ...children) => {
  const entity = new (class extends Entity.Container {
    container = new Container(this);
  })();
  entity.transform.set(options);
  entity.container.add(...children);
  return entity;
};

containerFactory.flex = (options, ...children) => {
  const entity = new (class extends Entity.Container {
    container = new Container(this);
  })();
  const { width, height, x, y, ...flexOptions } = options;
  entity.transform.set({ width, height, x, y });
  entity.container.layout.flex(flexOptions);
  entity.container.add(...children);
  return entity;
};

containerFactory.center = (options, ...children) => {
  const entity = new (class extends Entity.Container {
    container = new Container(this);
  })();
  entity.transform.set(options);
  entity.container.layout.flex({ justify: 'center', align: 'center' });
  entity.container.add(...children);
  return entity;
};

containerFactory.grid = (options, ...children) => {
  const entity = new (class extends Entity.Container {
    container = new Container(this);
  })();
  const { width, height, x, y, ...gridOptions } = options;
  entity.transform.set({ width, height, x, y });
  entity.container.layout.grid(gridOptions);
  entity.container.add(...children);
  return entity;
};
