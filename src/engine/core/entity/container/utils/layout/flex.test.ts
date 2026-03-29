import { describe, expect, it } from 'vitest';
import { applyFlexLayout } from './flex';
import { Entity } from '../../../../../core';

function box(w: number, h: number) {
  return Entity.container.box({ width: w, height: h });
}

describe('applyFlexLayout', () => {
  it('row: justify start + align start + gutter + gap', () => {
    const entity = Entity.container.box(
      { width: 100, height: 50 },
      box(10, 5),
      box(20, 8)
    );

    applyFlexLayout(
      { direction: 'row', justify: 'start', align: 'start', gap: 3, gutter: 2 },
      entity.container,
      entity
    );

    expect(entity.container.children[0].transform.x).toBe(2);
    expect(entity.container.children[1].transform.x).toBe(15);
    expect(entity.container.children[0].transform.y).toBe(2);
    expect(entity.container.children[1].transform.y).toBe(2);
  });

  describe('row: all justify x align variants (100x50, gap 0)', () => {
    const W = 100;
    const H = 50;

    it('justify start + align start', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'row', justify: 'start', align: 'start', gap: 0, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 0, y: 0 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 10, y: 0 });
    });

    it('justify start + align center', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'row', justify: 'start', align: 'center', gap: 0, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform.y).toBe(22.5);
      expect(entity.container.children[1].transform.y).toBe(21);
    });

    it('justify start + align end', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'row', justify: 'start', align: 'end', gap: 0, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform.y).toBe(45);
      expect(entity.container.children[1].transform.y).toBe(42);
    });

    it('justify center + align start', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'row', justify: 'center', align: 'start', gap: 0, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 35, y: 0 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 45, y: 0 });
    });

    it('justify center + align center', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'row', justify: 'center', align: 'center', gap: 0, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 35, y: 22.5 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 45, y: 21 });
    });

    it('justify center + align end', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'row', justify: 'center', align: 'end', gap: 0, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 35, y: 45 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 45, y: 42 });
    });

    it('justify space-between + align start', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        {
          direction: 'row',
          justify: 'space-between',
          align: 'start',
          gap: 0,
          gutter: 0,
        },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 0, y: 0 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 80, y: 0 });
    });

    it('justify space-between + align center', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        {
          direction: 'row',
          justify: 'space-between',
          align: 'center',
          gap: 0,
          gutter: 0,
        },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 0, y: 22.5 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 80, y: 21 });
    });

    it('justify space-between + align end', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        {
          direction: 'row',
          justify: 'space-between',
          align: 'end',
          gap: 0,
          gutter: 0,
        },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 0, y: 45 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 80, y: 42 });
    });
  });

  describe('column: all justify x align variants (100x60, gap 6)', () => {
    const W = 100;
    const H = 60;
    const gap = 6;

    it('justify start + align start', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'column', justify: 'start', align: 'start', gap, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 0, y: 0 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 0, y: 11 });
    });

    it('justify start + align center', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'column', justify: 'start', align: 'center', gap, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform.x).toBe(45);
      expect(entity.container.children[1].transform.x).toBe(40);
    });

    it('justify start + align end', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'column', justify: 'start', align: 'end', gap, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform.x).toBe(90);
      expect(entity.container.children[1].transform.x).toBe(80);
    });

    it('justify center + align start', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'column', justify: 'center', align: 'start', gap, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform.y).toBe(23.5);
      expect(entity.container.children[1].transform.y).toBe(34.5);
    });

    it('justify center + align center', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'column', justify: 'center', align: 'center', gap, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 45, y: 23.5 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 40, y: 34.5 });
    });

    it('justify center + align end', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        { direction: 'column', justify: 'center', align: 'end', gap, gutter: 0 },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 90, y: 23.5 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 80, y: 34.5 });
    });

    it('justify space-between + align start', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        {
          direction: 'column',
          justify: 'space-between',
          align: 'start',
          gap,
          gutter: 0,
        },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 0, y: 0 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 0, y: 52 });
    });

    it('justify space-between + align center', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        {
          direction: 'column',
          justify: 'space-between',
          align: 'center',
          gap,
          gutter: 0,
        },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 45, y: 0 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 40, y: 52 });
    });

    it('justify space-between + align end', () => {
      const entity = Entity.container.box({ width: W, height: H }, box(10, 5), box(20, 8));
      applyFlexLayout(
        {
          direction: 'column',
          justify: 'space-between',
          align: 'end',
          gap,
          gutter: 0,
        },
        entity.container,
        entity
      );
      expect(entity.container.children[0].transform).toMatchObject({ x: 90, y: 0 });
      expect(entity.container.children[1].transform).toMatchObject({ x: 80, y: 52 });
    });
  });

  it('column: align center on cross axis (single child)', () => {
    const entity = Entity.container.box({ width: 80, height: 100 }, box(20, 10));
    applyFlexLayout(
      { direction: 'column', justify: 'start', align: 'center', gap: 0, gutter: 0 },
      entity.container,
      entity
    );
    expect(entity.container.children[0].transform.x).toBe(30);
    expect(entity.container.children[0].transform.y).toBe(0);
  });
});