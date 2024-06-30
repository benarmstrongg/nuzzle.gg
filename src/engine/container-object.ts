import { Container, ContainerOptions } from 'pixi.js';

type ContainerObjectOptions<
    TSections extends Record<PropertyKey, any>,
    TChildren extends Container
> =
    | (ContainerOptions & {
          sections?: TSections;
      })
    | TChildren[];

export class ContainerObject<
    TSections extends Record<PropertyKey, any> = {},
    TChildren extends Container = Container,
    TData extends Record<PropertyKey, any> = any
> extends Container {
    sections: TSections;
    children: TChildren[];
    data: TData;

    constructor(props: ContainerObjectOptions<TSections, TChildren> = {}) {
        const children = Array.isArray(props)
            ? props
            : (props.children || []).concat(
                  Object.values(props.sections || {})
              );
        super({ ...props, children });
        this.children = children as TChildren[];
        this.sections =
            (!Array.isArray(props) && props.sections) || ({} as TSections);
    }

    render(container: Container): this {
        Object.values(this.sections).forEach((section) =>
            section.render?.(this)
        );
        container.addChild(this);
        return this;
    }
}
