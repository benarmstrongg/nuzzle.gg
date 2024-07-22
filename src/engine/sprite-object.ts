import { Sprite, SpriteOptions, Texture } from 'pixi.js';
import { ContainerObject } from './container-object';
import { Transform } from './transform';

export type SpriteObjectOptions<TData extends Record<PropertyKey, any> = any> =
    SpriteOptions & { data?: TData };

export class SpriteObject<
    TData extends Record<PropertyKey, any> = any
> extends Sprite {
    transform = new Transform(this);
    data: TData;

    constructor(props: SpriteObjectOptions<TData> = {}) {
        super(props);
        if (props.texture) {
            props.texture.source.scaleMode = 'nearest';
        }
        this.data = props.data || ({} as TData);
    }

    setTexture(texture: Texture, container: ContainerObject) {
        texture.source.scaleMode = 'nearest';
        this.texture = texture;
        container.addChild(this);
    }

    render(container: ContainerObject): this {
        container.addChild(this);
        return this;
    }
}
