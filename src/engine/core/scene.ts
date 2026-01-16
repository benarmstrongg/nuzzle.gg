import { Controls, Container, IContainer, ISprite } from '../traits';
import { Entity } from './entity';
import { game } from './game';

type SceneOptions = {
  loadingFallback?: Entity;
  backgroundAssetUrl?: string;
};

export abstract class Scene extends Entity implements IContainer {
  container: Container;
  private entity: Entity;
  private loadingFallback?: Entity;
  private background?: Entity & ISprite;

  constructor(options?: SceneOptions) {
    // TODO: do we really wanna unload scenes when we load a new one?
    // idk how we track tickers otherwise
    game.unloadScene();
    super();
    this.container = new Container(this);
    this.init(options);
  }

  private init(options?: SceneOptions) {
    const { loadingFallback, backgroundAssetUrl } = options ?? {};

    if (backgroundAssetUrl) {
      this.background = Entity.sprite({ assetUrl: backgroundAssetUrl });
      this.container.add(this.background);
    }

    if (loadingFallback) {
      this.loadingFallback = loadingFallback;
      this.container.add(this.loadingFallback);
    }
  }

  protected abstract render(): Entity;

  load() {
    this.entity = this.render();
    this.entity.onReady(() => {
      this.container.clear();
      this.container.add(this.entity);
    });
  }

  destroy() {
    Controls.clear();

    this.background?.destroy();
    this.loadingFallback?.destroy();
    this.entity.destroy();
    super.destroy();
  }
}

export interface IScene {
  scene: Scene;
}
