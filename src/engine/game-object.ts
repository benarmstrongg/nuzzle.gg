import {
    Container,
    Sprite,
    SpriteOptions,
    Texture,
    TextureSourceLike,
} from 'pixi.js';
import { MoveOptions } from './types';
import { App } from './app';

const DEFAULT_SPEED_PPT = 10;

export type GameObjectOptions<TData extends Record<PropertyKey, any> = any> =
    SpriteOptions & { data?: TData };

export class GameObject<
    TData extends Record<PropertyKey, any> = any
> extends Sprite {
    static from<TData extends Record<PropertyKey, any> = any>(
        source: Texture | TextureSourceLike,
        skipCache?: boolean | undefined
    ): GameObject {
        return new GameObject<TData>({ ...Sprite.from(source, skipCache) });
    }

    private isMoving: boolean = false;
    data: TData;

    constructor(props: GameObjectOptions<TData> = {}) {
        super(props);
        this.data = props.data || ({} as TData);
    }

    moveTo(opts: MoveOptions) {
        if (this.isMoving) {
            return;
        }
        this.isMoving = true;
        const { x: fromX, y: fromY } = this.position;
        const { x: toX = 0, y: toY = 0, speed = 1 } = opts;
        const speed_ppt = speed * DEFAULT_SPEED_PPT;
        const diffX = toX - fromX;
        const diffY = toY - fromY;
        const chooseX = diffX >= 0 ? Math.min : Math.max;
        const chooseY = diffY >= 0 ? Math.min : Math.max;
        const stepX = speed_ppt * (diffX >= 0 ? 1 : -1);
        const stepY = speed_ppt * (diffY >= 0 ? 1 : -1);
        App.tick((done) => {
            const { x, y } = this.position;
            if (x === toX && y === toY) {
                this.isMoving = false;
                return done();
            }
            const nextX = chooseX(x + stepX, toX);
            const nextY = chooseY(y + stepY, toY);
            this.position.set(nextX, nextY);
        });
    }

    moveBy(opts: MoveOptions) {
        this.moveTo({
            x: this.position.x + (opts.x || 0),
            y: this.position.y + (opts.y || 0),
            speed: opts.speed,
        });
    }

    setTexture(texture: Texture, container?: Container) {
        this.texture = texture;
        container?.addChild(this);
    }
}
