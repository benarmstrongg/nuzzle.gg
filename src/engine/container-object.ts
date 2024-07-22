import { Container, ContainerOptions } from 'pixi.js';
import { Transform } from './transform';

type ContainerObjectOptions<
    TSections extends Record<PropertyKey, any>,
    TChildren extends Container,
    TData extends Record<PropertyKey, any> = any
> =
    | (ContainerOptions & {
          sections?: TSections;
          data?: TData;
      })
    | TChildren[];

export class ContainerObject<
    TSections extends Record<PropertyKey, any> = {},
    TChildren extends Container = Container,
    TData extends Record<PropertyKey, any> = any
> extends Container {
    transform = new Transform(this);
    sections: TSections;
    children: TChildren[];
    data: TData;

    constructor(opts: ContainerObjectOptions<TSections, TChildren> = {}) {
        const isOpts = !Array.isArray(opts);
        const children = isOpts
            ? (opts.children || []).concat(Object.values(opts.sections || {}))
            : opts;
        const sortableChildren =
            isOpts && opts.sortableChildren !== undefined
                ? opts.sortableChildren
                : true;
        super({ ...opts, children, sortableChildren });
        this.children = children as TChildren[];
        this.sections = (isOpts && opts.sections) || ({} as TSections);
        this.data = (isOpts && opts.data) || ({} as TData);
    }

    render(container: ContainerObject): this {
        Object.values(this.sections).forEach((section) =>
            section.render?.(this)
        );
        container.addChild(this);
        return this;
    }
}
