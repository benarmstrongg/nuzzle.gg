import { describe, expect, it, vi } from 'vitest';
import { Signal } from './signal';

type Events = {
  ping: number;
  done: void;
};

describe('Signal', () => {
  it('calls listeners added via on', () => {
    const signal = new Signal<Events>();
    const listener = vi.fn();

    signal.on('ping', listener);
    signal.emit('ping', 42);
    signal.emit('ping', 300);

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith(42);
    expect(listener).toHaveBeenCalledWith(300);
  });

  it('calls listeners added via once only once', () => {
    const signal = new Signal<Events>();
    const listener = vi.fn();

    signal.once('ping', listener);
    signal.emit('ping', 1);
    signal.emit('ping', 2);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(1);
  });

  it('removes listeners via off', () => {
    const signal = new Signal<Events>();
    const listener = vi.fn();

    signal.on('ping', listener);
    signal.off('ping', listener);
    signal.emit('ping', 10);

    expect(listener).not.toHaveBeenCalled();
  });

  it('supports no-payload events with void type', () => {
    const signal = new Signal<Events>();
    const listener = vi.fn();

    signal.on('done', listener);
    signal.emit('done');

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(undefined);
  });
});
