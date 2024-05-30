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
        document.removeEventListener('keydown', this.eventListeners[action]);
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
            if (e.key === key) {
                callback();
            }
        };
    }
}

export const Controls = {
    wasd: new ControlsInstance({
        up: 'w',
        down: 's',
        left: 'a',
        right: 'd',
        a: 'k',
        b: 'l',
    }),
    arrowkeys: new ControlsInstance({
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight',
        a: ' ',
        b: 'Shift',
    }),
    get selected() {
        return this[App.settings.controlScheme];
    },
};