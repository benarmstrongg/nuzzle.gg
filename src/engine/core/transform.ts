import { Entity, game } from '.';
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

export class Transform {
  position = new State<TransformState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  global = new State<Coordinate>({ x: 0, y: 0 });
  scale: State<ScaleState> = new State({ x: 1, y: 1 });

  get x(): number {
    return this.position.x;
  }
  set x(x: number) {
    this.position.x = x;
    this.entity['inner'].position.set(x, this.y);
    const { x: globalX, y: globalY } = this.entity['inner'].getGlobalPosition();
    this.global.set({ x: globalX, y: globalY });
  }

  get y(): number {
    return this.position.y;
  }
  set y(y: number) {
    this.position.y = y;
    this.entity['inner'].position.set(this.x, y);
    const { x: globalX, y: globalY } = this.entity['inner'].getGlobalPosition();
    this.global.set({ x: globalX, y: globalY });
  }

  get width(): number {
    return this.position.width;
  }
  set width(width: number) {
    this.position.width = width;
  }

  get height(): number {
    return this.position.height;
  }
  set height(height: number) {
    this.position.height = height;
  }

  get globalX(): number {
    return this.global.x;
  }
  get globalY(): number {
    return this.global.y;
  }

  constructor(private entity: Entity) {
    const { x, y, width, height } = entity['inner'];
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  on = this.position.on.bind(this.position);
  once = this.position.once.bind(this.position);
  off = this.position.off.bind(this.position);

  set(state: Partial<TransformState>) {
    if (typeof state.x === 'number' && state.x !== this.x) this.x = state.x;
    if (typeof state.y === 'number' && state.y !== this.y) this.y = state.y;
    if (typeof state.width === 'number' && state.width !== this.width)
      this.width = state.width;
    if (typeof state.height === 'number' && state.height !== this.height)
      this.height = state.height;
  }

  moveBy(position: Partial<Coordinate>, duration: number) {
    const x = this.x + (position.x ?? 0);
    const y = this.y + (position.y ?? 0);
    return this.moveTo({ x, y }, duration);
  }

  moveTo(position: Partial<Coordinate>, duration: number) {
    const { promise, resolve } = Promise.withResolvers<void>();
    const toX = position.x ?? this.x;
    const toY = position.y ?? this.y;
    const stepX = (toX - this.x) / duration;
    const stepY = (toY - this.y) / duration;
    const directionX = toX > this.x ? 1 : -1;
    const directionY = toY > this.y ? 1 : -1;

    game.tick((done) => {
      const isXDone =
        (directionX === 1 && this.x >= toX) ||
        (directionX === -1 && this.x <= toX);
      const isYDone =
        (directionY === 1 && this.y >= toY) ||
        (directionY === -1 && this.y <= toY);

      if (isXDone && isYDone) {
        done();
        return resolve();
      }

      if (!isXDone) {
        this.x += stepX;
      }

      if (!isYDone) {
        this.y += stepY;
      }
    });

    return promise;
  }
}
