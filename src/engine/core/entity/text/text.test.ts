import { describe, expect, it } from 'vitest';
import { Entity } from '../entity';
import { Text } from './text';

describe('Text', () => {
  it('creates pixi text and sets entity ready', () => {
    const entity = new Entity();

    const text = new Text(entity, 'Hello', { size: 'sm', color: '#fff', wrap: true });
    expect(text.state.value).toBe('Hello');
    expect(entity.ready).toBe(true);
  });
});
