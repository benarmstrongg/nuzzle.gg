import { Text, TextOptions } from 'pixi.js';
import { ContainerObject } from './container-object';

export class TextObject extends Text {
    constructor(options: TextOptions) {
        super(options);
    }

    setText(text: string, container: ContainerObject) {
        this.text = text;
        this.render(container);
    }

    render(container: ContainerObject) {
        container.addChild(this);
    }
}
