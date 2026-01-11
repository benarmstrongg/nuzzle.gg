import { Assets, Texture } from 'pixi.js';
import { Dex, Pokemon } from '../../../../pokemon-showdown/sim';
import {
  App,
  ContainerObject,
  Controls,
  OnDestroy,
  OnInit,
  Scene,
  SpriteObject,
  TextObject,
} from '../../engine';
import { ItemIcon, PokemonSprite, TypeIcon } from '../../entities';
import { font } from '../../util/font.util';

import { ASSETS } from './summary.const';
import { SummaryPage } from './summary.types';
import { StatsPage } from './objects/stats-page.obj';
import { InfoPage } from './objects/info-page.obj';
import { MovesPage } from './objects/moves-page.obj';
import { CategoryIcon } from '../../entities/CategoryIcon.entity';

type SummaryLoadOptions = {
  pokemon: Pokemon;
  onClose: () => void;
};

export class SummaryScene extends Scene implements OnInit, OnDestroy {
  private $bg: SpriteObject = new SpriteObject();
  private $preview = new ContainerObject({
    sections: {
      nickname: new TextObject({
        style: font({ size: 'heading', color: 'white' }),
        position: { x: 15, y: 60 },
      }),
      level: new TextObject({
        style: font({ size: 'xxlarge' }),
        position: { x: 50, y: 98 },
      }),
      pokemon: new PokemonSprite({
        position: { x: 30, y: 140 },
        scale: 1.5,
      }),
      item: new ContainerObject({
        sections: {
          label: new TextObject({
            style: font({ size: 'xxlarge', color: 'white' }),
            position: { x: 110, y: 320 },
            text: 'Item',
          }),
          icon: new ItemIcon({
            position: { x: 8, y: 300 },
            scale: 1.5,
          }),
          name: new TextObject({
            style: font({ size: 'xxlarge' }),
            position: { x: 8, y: 355 },
          }),
        },
      }),
    },
  });
  private $pages: (ContainerObject & SummaryPage)[] = [
    new InfoPage(),
    new ContainerObject() as any,
    new StatsPage(),
    new MovesPage(),
    new ContainerObject() as any,
  ];
  private selectedIndex = 0;
  private onClose: () => void = () => {};
  private controls: Controls;

  async onInit(): Promise<void> {
    await Assets.load(ASSETS.BG);
    await TypeIcon.load();
    await CategoryIcon.load();
    this.controls = Controls.selected();
    this.controls.on('left', () => this.changePage(-1));
    this.controls.on('right', () => this.changePage(1));
    this.controls.on('b', () => App.unloadScene(this));
  }

  onDestroy() {
    this.controls.clear();
    this.onClose();
  }

  render(): ContainerObject {
    const scene = new ContainerObject();
    this.$bg.setTexture(Texture.from(ASSETS.BG[0]), scene);
    scene.addChild(this.$bg, this.$preview);
    this.$pages[this.selectedIndex].render(scene);
    return scene;
  }

  load(opts: SummaryLoadOptions) {
    this.setData(opts.pokemon);
    this.onClose = opts.onClose;
  }

  private setData(pokemon: Pokemon) {
    this.$pages.forEach(($page) => $page.setData?.(pokemon, this.container));
    this.$preview.sections.nickname.setText(pokemon.name, this.container);
    this.$preview.sections.level.setText(
      pokemon.level.toString(),
      this.container
    );
    this.$preview.sections.pokemon.setPokemon(pokemon.species, this.container);
    this.$preview.sections.item.sections.icon.setItem(
      pokemon.item,
      this.container
    );
    const itemData = Dex.items.get(pokemon.item);
    this.$preview.sections.item.sections.name.setText(
      itemData.name,
      this.container
    );
  }

  private changePage(distance: 1 | -1) {
    this.$pages[this.selectedIndex].removeFromParent();
    this.selectedIndex += distance;
    if (this.selectedIndex < 0) {
      this.selectedIndex = ASSETS.BG.length - 1;
    } else if (this.selectedIndex >= ASSETS.BG.length) {
      this.selectedIndex = 0;
    }
    this.$bg.setTexture(
      Texture.from(ASSETS.BG[this.selectedIndex]),
      this.container
    );
    this.$pages[this.selectedIndex].render(this.container);
    this.$preview.render(this.container);
  }
}
