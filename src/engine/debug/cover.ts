import { Graphics } from 'pixi.js';
import type { Entity } from '../core/entity';
import { game } from '../core/game';

export const cover = (entity: Entity) => {
  entity.onRender(() => {
    const { globalX: x, globalY: y, width, height } = entity.transform;
    const cover = new Graphics()
      .rect(x, y, width, height)
      .fill({ color: 0xff0000, alpha: 0.5 });
    cover.zIndex = 100000;

    game['inner'].stage.addChild(cover);
    entity['inner'].parent?.addChild(cover);

    entity.transform.position.onChange(({ x, y }) => {
      cover.position.set(x, y);
    });
  });
  return entity;
};
