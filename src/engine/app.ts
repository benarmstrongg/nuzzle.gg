import type { Scene } from './scene';
import type { ControlScheme } from './controls';
import { Assets, Application as PixiApplication } from 'pixi.js';

type AppSettings = {
    controlScheme: ControlScheme;
};

let pixi: PixiApplication;

export class App {
    private static activeScene?: Scene;
    static settings: AppSettings = {
        controlScheme: 'wasd',
    };

    static async init() {
        pixi = new PixiApplication();
        await pixi.init({
            // width: 900,
            // height: 900,
            background: 0xfffff1,

            resizeTo: window,
            antialias: true,
            roundPixels: true,
        });
        await App.loadFonts();
        document.body.append(pixi.canvas);
    }

    static async loadScene(scene: Scene) {
        if (this.activeScene) {
            await this.activeScene.destroy();
            pixi.stage.removeChildren();
        }
        await scene.init();

        scene.container.eventMode = 'static';
        scene.container.on('click', (e) => console.log(e.x, e.y));

        this.activeScene = scene;
        pixi.stage.addChild(scene.container);
    }

    static tick(fn: (done: () => void) => void) {
        const callback = () => fn(() => pixi.ticker.remove<void>(callback));
        pixi.ticker.add(callback);
    }

    private static async loadFonts() {
        Assets.addBundle('fonts', [
            { alias: 'PowerGreen', src: 'assets/fonts/power-green.ttf' },
            {
                alias: 'PowerClearBold',
                src: 'assets/fonts/power-clear-bold.ttf',
            },
        ]);
        await Assets.loadBundle('fonts');
    }
}
