import { Graphics } from 'pixi.js';
import { Entity, game } from '../core';

export const cover = <T extends Entity>(entity: T) => {
  entity.onReady(() => {
    const { x, y, width, height } = entity.transform;
    const cover = new Graphics()
      .rect(x, y, width, height)
      .fill({ color: 0xff0000, alpha: 0.5 });
    cover.zIndex = 100000;

    game['inner'].stage.addChild(cover);
    entity['inner'].parent?.addChild(cover);
  });
  return entity;
};
