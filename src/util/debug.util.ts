import { Container, FederatedPointerEvent } from 'pixi.js';
import { App } from '../engine';

export class Debug {
    static log<T>(obj: T): T {
        console.log(obj);
        return obj;
    }

    private static isDragInitialized = false;
    private static dragTarget: Container | null;
    static draggable<T extends Container>(obj: T): T {
        if (!Debug.isDragInitialized) {
            App.stage.eventMode = 'static';
            App.stage.hitArea = App.screen;
            App.stage.on('pointerup', Debug.onDragEnd);
            App.stage.on('pointerupoutside', Debug.onDragEnd);
        }
        obj.eventMode = 'static';
        obj.cursor = 'pointer';
        obj.zIndex = 1000;
        obj.on('pointerdown', Debug.onDragStart, obj);
        Debug.isDragInitialized = true;
        return obj;
    }

    private static onDragStart(this: Container) {
        this.alpha = 0.5;
        Debug.dragTarget = this;
        App.stage.on('pointermove', Debug.onDragMove);
    }

    private static onDragMove(e: FederatedPointerEvent) {
        const dragTarget = Debug.dragTarget;
        if (dragTarget) {
            dragTarget.position.x += e.movement.x;
            dragTarget.position.y += e.movement.y;
            const { x, y } = dragTarget.getGlobalPosition();
            console.log({
                global: { x, y },
                local: { x: dragTarget.x, y: dragTarget.y },
            });
        }
    }

    private static onDragEnd() {
        const dragTarget = Debug.dragTarget;
        if (dragTarget) {
            App.stage.off('pointermove', Debug.onDragMove);
            dragTarget.alpha = 1;
            Debug.dragTarget = null;
        }
    }
}
