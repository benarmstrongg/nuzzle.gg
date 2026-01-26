import { game } from './game';
import type { Entity } from './entity';
import type { Transform } from './transform';
import {
  type Container,
  containerFactory,
  Controls,
  Signal,
  spriteFactory,
} from '../traits';
import { ContainerEntity } from '../types';

type SceneOptions = {
  loadingFallback?: Entity;
  backgroundAssetUrl?: string;
};

type SceneEntity = ContainerEntity & { _scene: Scene };

export abstract class Scene {
  private entity: SceneEntity;
  private signal = new Signal<{
    load: void;
  }>();

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

    const { loadingFallback, backgroundAssetUrl } = options ?? {};

    // TODO: should this just be a sprite and make caller handle sprite stuff?
    if (backgroundAssetUrl) {
      this.entity.container.add(
        spriteFactory({ assetUrl: backgroundAssetUrl })
      );
    }

    if (loadingFallback) {
      this.entity.container.add(loadingFallback);
    }
  }

  protected abstract render(): ContainerEntity;

  onLoad(fn: () => void) {
    this.signal.once('load', fn);
  }

  load() {
    this.entity.destroy();
    this.setSceneEntity(this.render());
    this.signal.emit('load');
  }

  destroy() {
    Controls.clear();
    this.entity.destroy();
  }

  private setSceneEntity(entity: ContainerEntity) {
    const sceneEntity = entity as SceneEntity;
    sceneEntity._scene = this;
    this.entity = sceneEntity;
    this.entity.render(this.entity);
  }

  static isSceneEntity(entity: Entity): entity is SceneEntity {
    return !!entity && '_scene' in entity && !!entity._scene;
  }
}

export interface IScene {
  scene: Scene;
}
