import { Application as PixiApplication } from 'pixi.js';
import { Scene } from './scene';
import type { ControlScheme } from '../traits';
import { State } from '../traits/meta/state';
import { Fonts } from './fonts';

type Settings = {
  controlScheme: ControlScheme;
  defaultFont?: string;
};

class Game {
  private inner = new PixiApplication();
  settings = new State<Settings>({ controlScheme: 'wasd' });
  fonts = new Fonts();

  async init() {
    await this.inner.init({
      width: 500,
      height: 500,
      background: 0xfffff1,
      resizeTo: window,
      antialias: true,
      roundPixels: true,
    });

    await this.fonts.load();

    document.body.append(this.inner.canvas);
  }

  loadScene(scene: Scene) {
    scene.load();
    this.inner.stage.addChild(scene.container['inner']);
  }

  unloadScene(scene: Scene) {
    scene.destroy();
    this.inner.stage.removeChild(scene.container['inner']);
  }

  tick(fn: (done: () => void) => void) {
    const callback = () => fn(() => this.inner.ticker.remove<void>(callback));
    this.inner.ticker.add(callback);
  }

  async wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const game = new Game();
