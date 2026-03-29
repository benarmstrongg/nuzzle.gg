import { Signal } from './signal';

class StateProxy<T extends Record<string, any> = any> {
  private _values: T;
  private _propSignal = new Signal<T>();
  private _stateSignal = new Signal<{ change: T }>();

  private constructor(initialValue: T) {
    this._values = initialValue;
  }

  static init<T extends Record<string, any> = Record<string, any>>(
    initialValue: T
  ) {
    return new Proxy<State<T>>(
      new StateProxy<T>(initialValue) as State<T>,
      {
        get(state, prop, receiver) {
          if (prop in StateProxy.prototype || prop in state) {
            return Reflect.get(state, prop, receiver);
          }

          return state.get(prop as keyof T);
        },
        set(state, prop, value) {
          if (prop in StateProxy || prop in state) {
            return false;
          }

          state.setValue({ [prop]: value } as Partial<T>);
          return true;
        },
      }
    );
  }

  get(prop: keyof T): T[typeof prop] {
    return this._values[prop];
  }

  set(value: Partial<T>) {
    this.setValue(value);
  }

  onChange(listener: (change: T) => void) {
    this._stateSignal.on('change', listener);
  }

  on(prop: keyof T, listener: (value: T[typeof prop]) => void) {
    this._propSignal.on(prop, listener);
  }

  once(prop: keyof T, listener: (value: T[typeof prop]) => void) {
    this._propSignal.once(prop, listener);
  }

  off(prop: keyof T, listener: (value: T[typeof prop]) => void) {
    this._propSignal.off(prop, listener);
  }

  private setValue(value: Partial<T>) {
    let didAnyChange = false;

    for (const prop in value) {
      const propValue = value[prop]!;
      const didChange = propValue !== this._values[prop];

      if (!didChange) continue;

      didAnyChange = true;

      this._values[prop] = propValue;
      this._propSignal.emit(prop, propValue);
    }

    if (!didAnyChange) return;
    this._stateSignal.emit('change', { ...this._values, ...value });
  }
}

export type State<T extends Record<string, any>> = StateProxy<T> & {
  [K in keyof T]: T[K];
};

export const State = new Proxy(class State { }, {
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
