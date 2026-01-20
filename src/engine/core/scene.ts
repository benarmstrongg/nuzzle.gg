import { game } from './game';
import type { Entity } from './entity';
import type { Transform } from './transform';
import { containerFactory, spriteFactory, Controls } from '../traits';
import type { Container, IContainer, ISprite } from '../traits';

type SceneOptions = {
  loadingFallback?: Entity;
  backgroundAssetUrl?: string;
};

type SceneEntity = Entity & IContainer & { _scene: Scene };

export abstract class Scene {
  private entity: SceneEntity;
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
    this.setSceneEntity(containerFactory());
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
    this.entity.destroy();
    this.setSceneEntity(this.render());
  }

  destroy() {
    Controls.clear();

    this.background?.destroy();
    this.loadingFallback?.destroy();
    this.entity.destroy();
  }

  private setSceneEntity(entity: Entity & IContainer) {
    const sceneEntity = entity as SceneEntity;
    sceneEntity._scene = this;
    this.entity = sceneEntity;
  }

  static isSceneEntity(entity: Entity): entity is SceneEntity {
    return !!entity && '_scene' in entity && !!entity._scene;
  }
}

export interface IScene {
  scene: Scene;
}
