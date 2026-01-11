import { Container, IContainer } from '../traits/entity/container/container';
import { ISprite } from '../traits/entity/sprite/sprite';
import { Entity } from './entity';

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
    this.background?.destroy();
    this.loadingFallback?.destroy();
    this.entity.destroy();
    super.destroy();
  }
}

export interface IScene {
  scene: Scene;
}
