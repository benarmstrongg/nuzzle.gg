import { game } from './game';
import type { Entity } from './entity';
import type { Transform } from './transform';
import { containerFactory, spriteFactory, Controls } from '../traits';
import type { Container, IContainer, ISprite } from '../traits';

type SceneOptions = {
  loadingFallback?: Entity;
  backgroundAssetUrl?: string;
};

export abstract class Scene {
  private entity: Entity & IContainer;
  private loadingFallback?: Entity;
  private background?: Entity & ISprite;

  get container(): Container {
    return this.entity.container;
  }

  get transform(): Transform {
    return this.entity.transform;
  }

  constructor(options?: SceneOptions) {
    // TODO: do we really wanna unload scenes when we load a new one?
    // idk how we track tickers otherwise
    game.unloadScene();
    this.entity = containerFactory();
    this.init(options);
  }

  private init(options?: SceneOptions) {
    const { loadingFallback, backgroundAssetUrl } = options ?? {};

    // TODO: should this just be a sprite and make caller handle sprite stuff?
    if (backgroundAssetUrl) {
      this.background = spriteFactory({ assetUrl: backgroundAssetUrl });
      this.entity.container.add(this.background);
    }

    if (loadingFallback) {
      this.loadingFallback = loadingFallback;
      this.entity.container.add(this.loadingFallback);
    }
  }

  protected abstract render(): Entity & IContainer;

  load() {
    this.entity = this.render();
  }

  destroy() {
    Controls.clear();

    this.background?.destroy();
    this.loadingFallback?.destroy();
    this.entity.destroy();
  }
}

export interface IScene {
  scene: Scene;
}
