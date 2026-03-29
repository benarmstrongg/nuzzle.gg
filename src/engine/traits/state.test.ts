import { describe, expect, it, vi } from 'vitest';

import { State } from './state';

type TestState = {
  hp: number;
  mp: number;
  name: string;
};

function createState(initial: Partial<TestState> = {}) {
  return new State<TestState>({
    hp: 100,
    mp: 50,
    name: 'Hero',
    ...initial,
  });
}

describe('StateProxy', () => {
  it('reads values via direct access and get()', () => {
    const state = createState();

    expect(state.hp).toBe(100);
    expect(state.get('hp')).toBe(100);
    expect(state.get('name')).toBe('Hero');
  });

  it('updates values via set() and direct property assignment', () => {
    const state = createState();

    state.set({ hp: 75 });
    expect(state.hp).toBe(75);

    state.mp = 40;
    expect(state.mp).toBe(40);
  });

  it('emits per-property listeners when value changes', () => {
    const state = createState();
    const hpListener = vi.fn();
    const mpListener = vi.fn();

    state.on('hp', hpListener);
    state.on('mp', mpListener);

    state.set({ hp: 90 });
    state.set({ hp: 90 }); // no change
    state.mp = 25;

    expect(hpListener).toHaveBeenCalledTimes(1);
    expect(hpListener).toHaveBeenCalledWith(90);

    expect(mpListener).toHaveBeenCalledTimes(1);
    expect(mpListener).toHaveBeenCalledWith(25);
  });

  it('emits onChange snapshots that include updated values', () => {
    const state = createState();
    const onChange = vi.fn();

    state.onChange(onChange);
    state.set({ hp: 80, mp: 30 });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        hp: 80,
        mp: 30,
        name: 'Hero',
      })
    );
  });

  it('does not emit state onChange when nothing changed', () => {
    const state = createState();
    const onChange = vi.fn();

    state.onChange(onChange);
    state.set({ hp: 100 });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not emit when assigning same value via direct property assignment', () => {
    const state = createState();
    const hpListener = vi.fn();
    const onChange = vi.fn();

    state.on('hp', hpListener);
    state.onChange(onChange);
    state.hp = 100;

    expect(hpListener).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not emit when set() receives an empty patch', () => {
    const state = createState();
    const hpListener = vi.fn();
    const onChange = vi.fn();

    state.on('hp', hpListener);
    state.onChange(onChange);
    state.set({});

    expect(hpListener).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('emits only changed property listeners for mixed set() patches', () => {
    const state = createState();
    const hpListener = vi.fn();
    const mpListener = vi.fn();
    const onChange = vi.fn();

    state.on('hp', hpListener);
    state.on('mp', mpListener);
    state.onChange(onChange);

    state.set({ hp: 90, mp: 50 });

    expect(hpListener).toHaveBeenCalledTimes(1);
    expect(hpListener).toHaveBeenCalledWith(90);
    expect(mpListener).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        hp: 90,
        mp: 50,
        name: 'Hero',
      })
    );
  });

  it('emits each changed property listener once for multi-field updates', () => {
    const state = createState();
    const hpListener = vi.fn();
    const mpListener = vi.fn();

    state.on('hp', hpListener);
    state.on('mp', mpListener);
    state.set({ hp: 80, mp: 30 });

    expect(hpListener).toHaveBeenCalledTimes(1);
    expect(hpListener).toHaveBeenCalledWith(80);
    expect(mpListener).toHaveBeenCalledTimes(1);
    expect(mpListener).toHaveBeenCalledWith(30);
  });

  it('supports once listeners', () => {
    const state = createState();
    const onceListener = vi.fn();

    state.once('hp', onceListener);
    state.hp = 99;
    state.hp = 88;

    expect(onceListener).toHaveBeenCalledTimes(1);
    expect(onceListener).toHaveBeenCalledWith(99);
  });

  it('supports removing listeners with off()', () => {
    const state = createState();
    const listener = vi.fn();

    state.on('hp', listener);
    state.off('hp', listener);
    state.hp = 42;

    expect(listener).not.toHaveBeenCalled();
  });

  it('keeps listener subscribed when off() receives a different function', () => {
    const state = createState();
    const listener = vi.fn();
    const differentListener = vi.fn();

    state.on('hp', listener);
    state.off('hp', differentListener);
    state.hp = 42;

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(42);
  });

  it('supports manual emit()', () => {
    const state = createState();
    const listener = vi.fn();

    state.on('hp', listener);
    state.emit('hp', 33);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(33);
  });

  it('suppresses prop emits inside silent()', () => {
    const state = createState();
    const hpListener = vi.fn();
    const onChange = vi.fn();

    state.on('hp', hpListener);
    state.onChange(onChange);

    state.silent(() => {
      state.hp = 70;
      state.set({ mp: 10 });
    });

    expect(state.hp).toBe(70);
    expect(state.mp).toBe(10);
    expect(hpListener).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();

    state.hp = 60;
    expect(hpListener).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        hp: 60,
        mp: 10,
        name: 'Hero',
      })
    );
  });

  it('restores non-silent mode if silent() callback throws', () => {
    const state = createState();
    const hpListener = vi.fn();

    state.on('hp', hpListener);

    expect(() =>
      state.silent(() => {
        state.hp = 95;
        throw new Error('boom');
      })
    ).toThrow('boom');

    expect(hpListener).not.toHaveBeenCalled();

    state.hp = 85;
    expect(hpListener).toHaveBeenCalledTimes(1);
    expect(hpListener).toHaveBeenCalledWith(85);
  });
});
