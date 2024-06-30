import { App } from './app';

export type ControlScheme = 'wasd' | 'arrowkeys';

type ControlsAction = 'up' | 'down' | 'left' | 'right' | 'a' | 'b';

class ControlsInstance {
    private eventListeners: Record<ControlsAction, (e: KeyboardEvent) => void> =
        {
            up: () => {},
            down: () => {},
            left: () => {},
            right: () => {},
            a: () => {},
            b: () => {},
        };
    private isActive = true;

    constructor(private readonly keys: Record<ControlsAction, string>) {}

    on(action: ControlsAction, callback: () => void) {
        console.log(`controls ${action} registered`);
        this.eventListeners[action] = this.createKeybindingListener(
            this.keys[action],
            callback
        );
        document.addEventListener('keydown', this.eventListeners[action]);
    }

    off(action: ControlsAction) {
        console.log(`controls ${action} deregistered`);
        delete this.eventListeners[action];
        document.removeEventListener('keydown', this.eventListeners[action]);
    }

    pause() {
        this.isActive = false;
    }

    resume() {
        this.isActive = true;
    }

    clear() {
        for (const action in this.eventListeners) {
            this.off(action as ControlsAction);
        }
    }

    private createKeybindingListener(
        key: string,
        callback: () => void
    ): (e: KeyboardEvent) => void {
        return (e: KeyboardEvent) => {
            if (!this.isActive) {
                return;
            }
            if (e.key.toLowerCase() === key.toLowerCase()) {
                callback();
            }
        };
    }
}

export const Controls = {
    wasd: () =>
        new ControlsInstance({
            up: 'w',
            down: 's',
            left: 'a',
            right: 'd',
            a: 'k',
            b: 'l',
        }),
    arrowkeys: () =>
        new ControlsInstance({
            up: 'ArrowUp',
            down: 'ArrowDown',
            left: 'ArrowLeft',
            right: 'ArrowRight',
            a: ' ',
            b: 'Shift',
        }),
    selected() {
        return this[App.settings.controlScheme]();
    },
};

export type Controls = ControlsInstance;
