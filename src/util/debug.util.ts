import { Container, FederatedPointerEvent } from 'pixi.js';
import { App } from '../engine';

export function log<T>(obj: T): T {
    console.log(obj);
    return obj;
}

let isDragInitialized = false;
let dragTarget: Container | null;
export function draggable<T extends Container>(obj: T): T {
    if (!isDragInitialized) {
        App.stage.eventMode = 'static';
        App.stage.hitArea = App.screen;
        App.stage.on('pointerup', onDragEnd);
        App.stage.on('pointerupoutside', onDragEnd);
    }
    obj.eventMode = 'static';
    obj.cursor = 'pointer';
    obj.on('pointerdown', onDragStart, obj);
    isDragInitialized = true;
    return obj;
}
function onDragStart(this: Container) {
    this.alpha = 0.5;
    dragTarget = this;
    App.stage.on('pointermove', onDragMove);
}
function onDragMove(e: FederatedPointerEvent) {
    if (dragTarget) {
        dragTarget.position.x += e.movement.x;
        dragTarget.position.y += e.movement.y;
        const { x, y } = dragTarget.getGlobalPosition();
        console.log(
            `global: ${x}, ${y}`,
            `local: ${dragTarget.x}, ${dragTarget.y}`
        );
    }
}
function onDragEnd() {
    if (dragTarget) {
        App.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;
    }
}
