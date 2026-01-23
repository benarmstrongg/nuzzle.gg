type SignalListener<T> = {
  type: 'once' | 'on';
  fn: (value: T) => void | Promise<void>;
};

export class Signal<
  TEvents extends Record<string, unknown> = Record<string, unknown>
> {
  private listeners: Partial<{
    [E in keyof TEvents]: Map<
      SignalListener<TEvents[E]>['fn'],
      SignalListener<TEvents[E]>
    >;
  }> = {};

  on<E extends keyof TEvents>(
    event: E,
    listener: SignalListener<TEvents[E]>['fn']
  ) {
    this.addListener('on', event, listener);
  }

  once<E extends keyof TEvents>(
    event: E,
    listener: SignalListener<TEvents[E]>['fn']
  ) {
    this.addListener('once', event, listener);
  }

  off<E extends keyof TEvents>(
    event: E,
    listener: SignalListener<TEvents[E]>['fn']
  ) {
    this.listeners[event]?.delete(listener);
  }

  emit<E extends keyof TEvents>(
    event: TEvents[E] extends void ? E : void
  ): void;
  emit<E extends keyof TEvents>(event: E, data: TEvents[E]): void;
  emit<E extends keyof TEvents>(event: E, data?: TEvents[E]): void {
    if (!this.listeners[event]) {
      return;
    }

    for (const { type, fn } of this.listeners[event].values()) {
      fn(data as TEvents[E]);

      if (type === 'once') {
        this.off(event, fn);
      }
    }
  }

  private addListener<E extends keyof TEvents>(
    type: SignalListener<TEvents[E]>['type'],
    event: E,
    fn: SignalListener<TEvents[E]>['fn']
  ) {
    this.listeners[event] ??= new Map();
    this.listeners[event].set(fn, { type, fn });
  }
}

export interface ISignal {
  signal: Signal<any>;
}
