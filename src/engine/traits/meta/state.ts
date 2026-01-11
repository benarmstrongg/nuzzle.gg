import { Signal } from './signal';

class StateProxy<T extends Record<string, any> = any> {
  private signal = new Signal<T>();

  private constructor() {}

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
    return (this as any)[prop];
  }

  set(value: Partial<T>) {
    this.setValue(value);
  }

  on = this.signal.on.bind(this.signal);
  once = this.signal.once.bind(this.signal);
  off = this.signal.off.bind(this.signal);

  private setValue(value: Partial<T>) {
    for (const prop in value) {
      const propValue = value[prop]!;
      this.signal.emit(prop, propValue);
      Object.assign(this, { [prop]: propValue });
    }
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
