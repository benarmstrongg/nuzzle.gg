import { game } from '../../core';

export type ControlScheme = 'wasd' | 'arrowkeys';

type ControlsAction = 'up' | 'down' | 'left' | 'right' | 'a' | 'b';

type KeyboardCallback = (e: KeyboardEvent) => void;

type ControlsCallback = () => void | Promise<void>;

export class Controls {
  private static activeControls: Controls[] = [];

  private pressListeners: Record<ControlsAction, KeyboardCallback> = {
    up: () => {},
    down: () => {},
    left: () => {},
    right: () => {},
    a: () => {},
    b: () => {},
  };
  private holdListeners: Record<
    ControlsAction,
    {
      down: KeyboardCallback;
      up: KeyboardCallback;
    }
  > = {
    up: { down: () => {}, up: () => {} },
    down: { down: () => {}, up: () => {} },
    left: { down: () => {}, up: () => {} },
    right: { down: () => {}, up: () => {} },
    a: { down: () => {}, up: () => {} },
    b: { down: () => {}, up: () => {} },
  };
  private isActive = true;

  constructor(private readonly keys: Record<ControlsAction, string>) {
    Controls.activeControls.push(this);
  }

  press(action: ControlsAction, callback: ControlsCallback) {
    this.pressListeners[action] = this.createKeybindingListener(
      this.keys[action],
      callback
    );

    document.addEventListener('keypress', this.pressListeners[action]);
  }

  hold(action: ControlsAction, down: ControlsCallback, up: ControlsCallback) {
    this.holdListeners[action].down = this.createKeybindingListener(
      this.keys[action],
      down
    );
    this.holdListeners[action].up = this.createKeybindingListener(
      this.keys[action],
      up
    );

    document.addEventListener('keydown', this.holdListeners[action].down);
    document.addEventListener('keyup', this.holdListeners[action].up);
  }

  off(action: ControlsAction) {
    document.removeEventListener('keypress', this.pressListeners[action]);
    this.pressListeners[action] = () => {};

    document.removeEventListener('keydown', this.holdListeners[action].down);
    this.holdListeners[action].down = () => {};
    document.removeEventListener('keyup', this.holdListeners[action].up);
    this.holdListeners[action].up = () => {};
  }

  pause() {
    this.isActive = false;
  }

  resume() {
    this.isActive = true;
  }

  clear() {
    this.off('up');
    this.off('down');
    this.off('left');
    this.off('right');
    this.off('a');
    this.off('b');
  }

  private createKeybindingListener(
    key: string,
    callback: ControlsCallback
  ): (e: KeyboardEvent) => void {
    return async (e: KeyboardEvent) => {
      if (!this.isActive) {
        return;
      }
      if (e.key.toLowerCase() === key.toLowerCase()) {
        await callback();
      }
    };
  }

  static clear() {
    for (const control of this.activeControls) {
      control.clear();
    }
    this.activeControls = [];
  }

  static wasd() {
    return new Controls({
      up: 'w',
      down: 's',
      left: 'a',
      right: 'd',
      a: 'k',
      b: 'l',
    });
  }

  static arrowkeys() {
    return new Controls({
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
      a: ' ',
      b: 'Shift',
    });
  }

  static selected() {
    return Controls[game.settings.controlScheme]();
  }
}

export interface IControls {
  controls: Controls;
}
