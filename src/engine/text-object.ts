import { Container, Text, TextOptions } from 'pixi.js';

export class TextObject extends Text {
    constructor(options: TextOptions) {
        super(options);
    }

    setText(text: string, container: Container) {
        this.text = text;
        this.render(container);
    }

    render(container: Container) {
        container.addChild(this);
    }
}
