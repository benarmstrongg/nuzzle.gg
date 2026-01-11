import { FederatedPointerEvent } from 'pixi.js';
import { GameObject } from '../core/object';
import { Entity, game } from '../core';

let isDragInitialized = false;
let dragTarget: GameObject | null;
export function draggable<T extends Entity>(obj: T): T {
  if (!isDragInitialized) {
    game['inner'].stage.eventMode = 'static';
    game['inner'].stage.hitArea = game['inner'].screen;
    game['inner'].stage.on('pointerup', onDragEnd);
    game['inner'].stage.on('pointerupoutside', onDragEnd);
  }
  obj['inner'].eventMode = 'static';
  obj['inner'].cursor = 'pointer';
  obj['inner'].on('pointerdown', onDragStart, obj);
  isDragInitialized = true;
  return obj;
}
function onDragStart(this: Entity) {
  this['inner'].alpha = 0.5;
  dragTarget = this['inner'];
  game['inner'].stage.on('pointermove', onDragMove);
}
function onDragMove(e: FederatedPointerEvent) {
  if (!dragTarget) {
    return;
  }
  dragTarget.position.x += e.movement.x;
  dragTarget.position.y += e.movement.y;
  const { x, y } = dragTarget.getGlobalPosition();
  console.log(`global: ${x}, ${y}`, `local: ${dragTarget.x}, ${dragTarget.y}`);
}
function onDragEnd() {
  game['inner'].stage.off('pointermove', onDragMove);
  if (!dragTarget) {
    return;
  }
  dragTarget.alpha = 1;
  dragTarget = null;
}
