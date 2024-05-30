import { Container } from 'pixi.js';
import { Controls } from './controls';
import { ContainerObject } from './container-object';

export interface OnInit {
    onInit(): void | Promise<void>;
}

export interface OnDestroy {
    onDestroy(): void | Promise<void>;
}

export abstract class Scene {
    abstract render(): Promise<ContainerObject>;
    container: Container;

    async init() {
        await this.runLifecycleMethod<OnInit>('onInit');
        this.container = await this.render();
    }

    async destroy() {
        await this.runLifecycleMethod<OnDestroy>('onDestroy');
        Controls.wasd.clear();
    }

    private async runLifecycleMethod<T>(methodName: keyof T) {
        function hasLifecycleMethod(obj: any): obj is Scene & T {
            return obj[methodName] !== undefined;
        }
        if (hasLifecycleMethod(this)) {
            await (this[methodName] as () => Promise<void>)();
        }
    }
}
