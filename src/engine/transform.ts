import { Container } from 'pixi.js';
import { App } from './app';

const DEFAULT_MOVE_SPEED_PPT = 10;

export type MoveOptions = Partial<{ x: number; y: number; speed: number }>;

export class Transform {
    private isMoving = false;

    constructor(private obj: Container) {}

    async moveTo(opts: MoveOptions) {
        return new Promise<void>((res) => {
            if (this.isMoving) {
                return;
            }
            this.isMoving = true;
            const { x: fromX, y: fromY } = this.obj.position;
            const { x: toX = 0, y: toY = 0, speed = 1 } = opts;
            const speed_ppt = speed * DEFAULT_MOVE_SPEED_PPT;
            const diffX = toX - fromX;
            const diffY = toY - fromY;
            const chooseX = diffX >= 0 ? Math.min : Math.max;
            const chooseY = diffY >= 0 ? Math.min : Math.max;
            const stepX = speed_ppt * (diffX >= 0 ? 1 : -1);
            const stepY = speed_ppt * (diffY >= 0 ? 1 : -1);
            App.tick((done) => {
                const { x, y } = this.obj.position;
                if (x === toX && y === toY) {
                    this.isMoving = false;
                    done();
                    return res();
                }
                const nextX = chooseX(x + stepX, toX);
                const nextY = chooseY(y + stepY, toY);
                this.obj.position.set(nextX, nextY);
            });
        });
    }

    async moveBy(opts: MoveOptions) {
        return this.moveTo({
            x: this.obj.position.x + (opts.x || 0),
            y: this.obj.position.y + (opts.y || 0),
            speed: opts.speed,
        });
    }
}
