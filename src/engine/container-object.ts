import { Container, ContainerOptions } from 'pixi.js';

type ContainerObjectOptions<TSections extends Record<PropertyKey, any>> =
    ContainerOptions & {
        sections?: TSections;
    };

export class ContainerObject<
    TSections extends Record<PropertyKey, any> = {},
    TChildren extends Container = Container
> extends Container {
    sections: TSections;
    children: TChildren[];

    constructor(props: ContainerObjectOptions<TSections> = {}) {
        const children = (props.children || []).concat(
            Object.values(props.sections || {})
        );
        super({ ...props, children });
        this.children = children as TChildren[];
        this.sections = props.sections || ({} as TSections);
    }
}
