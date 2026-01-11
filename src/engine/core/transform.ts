import { Entity } from '.';
import { State } from '../traits/meta/state';

export type Coordinate = {
  x: number;
  y: number;
};

export type TransformState = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ScaleState = {
  x: number;
  y: number;
};

// type TransformOptions = {
//   x?: number;
//   y?: number;
//   width?: number;
//   height?: number;
// };

// TODO move this out of traits?
// it's on entities by default
export class Transform {
  private state = new State<TransformState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  scale: State<ScaleState> = new State({ x: 1, y: 1 });

  get x(): number {
    return this.state.x;
  }
  set x(x: number) {
    this.state.x = x;
    this.entity['inner'].position.set(x, this.y);
  }

  get y(): number {
    return this.state.y;
  }
  set y(y: number) {
    this.state.y = y;
    this.entity['inner'].position.set(this.x, y);
  }

  get width(): number {
    return this.state.width;
  }
  set width(width: number) {
    this.state.width = width;
    // this.entity['inner'].width = width;
  }

  get height(): number {
    return this.state.height;
  }
  set height(height: number) {
    this.state.height = height;
    // this.entity['inner'].height = height;
  }

  get globalX(): number {
    return this.entity['inner'].getGlobalPosition().x;
  }
  get globalY(): number {
    return this.entity['inner'].getGlobalPosition().y;
  }

  constructor(private entity: Entity) {
    const { x, y, width, height } = entity['inner'];
    this.state.set({ x, y, width, height });
    // this.scale.on('x', (scaleX) => {
    //   this.entity['inner'].scale.x = scaleX;
    //   this.width = this.entity['inner'].width;
    // });
    // this.scale.on('y', (scaleY) => {
    //   this.entity['inner'].scale.y = scaleY;
    //   this.height = this.entity['inner'].height;
    // });
  }

  on = this.state.on.bind(this.state);
  once = this.state.once.bind(this.state);
  off = this.state.off.bind(this.state);

  set(state: Partial<TransformState>) {
    if (typeof state.x === 'number' && state.x !== this.x) this.x = state.x;
    if (typeof state.y === 'number' && state.y !== this.y) this.y = state.y;
    if (typeof state.width === 'number' && state.width !== this.width)
      this.width = state.width;
    if (typeof state.height === 'number' && state.height !== this.height)
      this.height = state.height;
  }
}

// export interface ITransform {
//   transform: Transform;
// }
