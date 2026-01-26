import { Signal } from './signal';

class StateProxy<T extends Record<string, any> = any> {
  private propSignal = new Signal<T>();
  private stateSignal = new Signal<{ change: T }>();

  private constructor() {}

  private get _state(): T {
    return this as unknown as T;
  }

  static init<T extends Record<string, any> = Record<string, any>>(
    initialValue: T
  ) {
    return new Proxy<State<T>>(
      Object.assign(new StateProxy<T>(), initialValue),
      {
        set(state, prop, value) {
          if (prop in State.prototype || prop === 'listeners') {
            return false;
          }

          state.setValue({ [prop]: value } as Partial<T>);
          return true;
        },
      }
    );
  }

  get(prop: keyof T): T[typeof prop] {
    return this._state[prop];
  }

  set(value: Partial<T>) {
    this.setValue(value);
  }

  onChange(listener: (change: T) => void) {
    this.stateSignal.on('change', listener);
  }

  on(prop: keyof T, listener: (value: T[typeof prop]) => void) {
    this.propSignal.on(prop, listener);
  }

  once(prop: keyof T, listener: (value: T[typeof prop]) => void) {
    this.propSignal.once(prop, listener);
  }

  off(prop: keyof T, listener: (value: T[typeof prop]) => void) {
    this.propSignal.off(prop, listener);
  }

  private setValue(value: Partial<T>) {
    let didAnyChange = false;

    for (const prop in value) {
      const propValue = value[prop]!;
      const didChange = propValue !== this._state[prop];
      didAnyChange = didAnyChange || didChange;
      if (!didChange) continue;
      this.propSignal.emit(prop, propValue);
      Object.assign(this, { [prop]: propValue });
    }

    if (!didAnyChange) return;
    this.stateSignal.emit('change', { ...this._state, ...value });
  }
}

export type State<T extends Record<string, any>> = StateProxy<T> & {
  [K in keyof T]: T[K];
};

export const State = new Proxy(class State {}, {
  construct: (_target, [initialValue]: any[]) => {
    return StateProxy.init(initialValue);
  },
}) as {
  new <TState extends Record<string, any>>(
    initialValue: TState
  ): StateProxy<TState> & TState;
};

export interface IState {
  state: State<any>;
}
