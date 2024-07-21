import { ContainerObject } from './container-object';

export interface OnInit {
    /**
     * Called when the scene is initialized before rendering
     */
    onInit(): void | Promise<void>;
}

export interface AfterRender {
    /**
     * Called after the scene is rendered
     */
    afterRender(): void | Promise<void>;
}

export interface OnDestroy {
    /**
     * Called when the scene is unloaded or destroy() is manually called
     */
    onDestroy(): void | Promise<void>;
}

export abstract class Scene {
    abstract render(): ContainerObject;
    container: ContainerObject;

    async init() {
        await this.runLifecycleMethod<OnInit>('onInit');
        this.container = this.render();
        await this.runLifecycleMethod<AfterRender>('afterRender');
    }

    async destroy() {
        await this.runLifecycleMethod<OnDestroy>('onDestroy');
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
