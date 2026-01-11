import { Pokemon } from 'pokemon-showdown/sim';
import {
  Container,
  Entity,
  IContainer,
  Random,
} from '../../../../../../../engine';
import { StoragePageHeader } from './StoragePageHeader.entity';
import { StoragePageGrid } from './StoragePageGrid.entitiy';

const backgroundAssets = [
  'sprites/ui/box/box_0.png',
  'sprites/ui/box/box_1.png',
  'sprites/ui/box/box_2.png',
  'sprites/ui/box/box_3.png',
  'sprites/ui/box/box_4.png',
  'sprites/ui/box/box_5.png',
  'sprites/ui/box/box_6.png',
  'sprites/ui/box/box_7.png',
  'sprites/ui/box/box_8.png',
  'sprites/ui/box/box_9.png',
  'sprites/ui/box/box_10.png',
  'sprites/ui/box/box_11.png',
  'sprites/ui/box/box_12.png',
  'sprites/ui/box/box_13.png',
  'sprites/ui/box/box_14.png',
  'sprites/ui/box/box_15.png',
  'sprites/ui/box/box_16.png',
  'sprites/ui/box/box_17.png',
  'sprites/ui/box/box_18.png',
  'sprites/ui/box/box_19.png',
  'sprites/ui/box/box_20.png',
  'sprites/ui/box/box_21.png',
  'sprites/ui/box/box_22.png',
  'sprites/ui/box/box_23.png',
  'sprites/ui/box/box_24.png',
  'sprites/ui/box/box_25.png',
  'sprites/ui/box/box_26.png',
  'sprites/ui/box/box_27.png',
  'sprites/ui/box/box_28.png',
  'sprites/ui/box/box_29.png',
  'sprites/ui/box/box_30.png',
  'sprites/ui/box/box_31.png',
  'sprites/ui/box/box_32.png',
  'sprites/ui/box/box_33.png',
  'sprites/ui/box/box_34.png',
  'sprites/ui/box/box_35.png',
  'sprites/ui/box/box_36.png',
  'sprites/ui/box/box_37.png',
  'sprites/ui/box/box_38.png',
  'sprites/ui/box/box_39.png',
];

const width = 320;
const height = 292;

export class StoragePage extends Entity implements IContainer {
  container = new Container(this);
  grid: StoragePageGrid;

  constructor(pagePokemon: Pokemon[]) {
    super();

    this.grid = new StoragePageGrid(pagePokemon);

    this.transform.set({ width, height });

    this.container.add(
      Entity.sprite({
        assetUrl: backgroundAssets[Random.int(backgroundAssets.length)],
        fallbackAssetUrls: backgroundAssets,
      }),
      new StoragePageHeader('AYOOO'),
      this.grid
    );
  }
}
