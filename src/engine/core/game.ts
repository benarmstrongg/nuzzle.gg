import { Application as PixiApplication, Ticker } from 'pixi.js';
import { Scene } from './scene';
import type { ControlScheme } from '../traits';
import { State } from '../traits/meta/state';
import { Fonts } from './fonts';

type Settings = {
  controlScheme: ControlScheme;
  defaultFont?: string;
};

class Game {
  private inner: PixiApplication;
  settings = new State<Settings>({ controlScheme: 'wasd' });
  fonts = new Fonts();
  activeScene: Scene | null = null;

  async init() {
    if (this.inner) return;

    this.inner = new PixiApplication();

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
    this.activeScene = scene;
  }

  unloadScene() {
    if (!this.activeScene) return;

    this.inner.stage.removeChild(this.activeScene.container['inner']);
    this.activeScene.destroy();
    this.activeScene = null;

    this.clearTicker();
  }

  tick(fn: (done: () => void) => void) {
    const callback = () => fn(() => this.inner.ticker.remove<void>(callback));
    this.inner.ticker.add(callback);
  }

  async wait(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private clearTicker() {
    const oldTicker = this.inner.ticker;
    this.inner.ticker = new Ticker();
    this.inner.ticker.autoStart = true;
    oldTicker.destroy();
  }
}

export const game = new Game();
