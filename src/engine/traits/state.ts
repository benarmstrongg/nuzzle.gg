import { Signal } from './signal';

class StateProxy<T extends Record<string, any> = any> {
  private _inner: {
    values: T;
    propSignal: Signal<T>;
    stateSignal: Signal<{ change: [T, T] }>;
    isSilent: boolean;
  };

  private constructor(initialValue: T) {
    this._inner = {
      values: initialValue,
      propSignal: new Signal(),
      stateSignal: new Signal(),
      isSilent: false,
    };
  }

  static init<T extends Record<string, any> = Record<string, any>>(
    initialValue: T
  ) {
    return new Proxy<State<T>>(new StateProxy<T>(initialValue) as State<T>, {
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
    });
  }

  get(prop: keyof T): T[typeof prop] {
    return this._inner.values[prop];
  }

  set(value: Partial<T>) {
    this.setValue(value);
  }

  onChange(listener: ([current, previous]: [T, T]) => void) {
    this._inner.stateSignal.on('change', listener);
  }

  offChange(listener: ([current, previous]: [T, T]) => void) {
    this._inner.stateSignal.off('change', listener);
  }

  on(prop: keyof T, listener: (value: T[typeof prop]) => void) {
    this._inner.propSignal.on(prop, listener);
  }

  once(prop: keyof T, listener: (value: T[typeof prop]) => void) {
    this._inner.propSignal.once(prop, listener);
  }

  off(
    prop: keyof T | 'change',
    listener: (value: T[typeof prop]) => void
  ): void {
    this._inner.propSignal.off(prop, listener);
  }

  emit(prop: keyof T, value: T[typeof prop]) {
    this._inner.propSignal.emit(prop, value);
  }

  silent(fn: () => void) {
    this._inner.isSilent = true;
    try {
      fn();
    } finally {
      this._inner.isSilent = false;
    }
  }

  private setValue(value: Partial<T>) {
    let didAnyChange = false;
    const previous = { ...this._inner.values };

    for (const prop in value) {
      const propValue = value[prop]!;
      const didChange = propValue !== this._inner.values[prop];

      if (!didChange) continue;

      didAnyChange = true;

      this._inner.values[prop] = propValue;
      if (!this._inner.isSilent) this._inner.propSignal.emit(prop, propValue);
    }

    if (!didAnyChange || this._inner.isSilent) return;
    const current = { ...this._inner.values, ...value };
    this._inner.stateSignal.emit('change', [current, previous]);
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
