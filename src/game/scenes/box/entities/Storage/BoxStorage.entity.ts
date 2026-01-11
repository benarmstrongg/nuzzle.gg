import { Pokemon } from 'pokemon-showdown/sim';
import {
  Container,
  Entity,
  IContainer,
  ISignal,
  Signal,
} from '../../../../../engine';
import { Menu } from '../../../../entities';
import { StorageCursor, StoragePage } from './entities';

// export class BoxStorageSeeBelow extends Entity implements IContainer {
//   private $boxCursor: BoxCursor;
//   private pages: BoxPage[] = [];
//   private activePageIndex = 0;
//   private $preview = new BoxPreview();
//   private $partyButton = new TextObject({
//     text: BUTTONS.PARTY.TEXT,
//     style: font({ size: 'heading', weight: 'bold' }),
//     position: BUTTONS.PARTY.POSITION,
//   });
//   private $startButton = new TextObject({
//     text: BUTTONS.START.TEXT,
//     style: font({ size: 'heading', weight: 'bold' }),
//     position: BUTTONS.START.POSITION,
//   });
//   private $pokemonStorageMenu: Menu<
//     typeof MENU_ITEMS.POKEMON_STORAGE,
//     { pokemon: Pokemon }
//   >;
//   private $itemMenu: Menu<typeof MENU_ITEMS.ITEM>;
//   private $partyTray = new BoxPartyTray();
//   private controls: Controls;

//   constructor(private readonly pokemonData: Pokemon[]) {
//     super();
//     this.container.add();
//   }

//   async onInit(): Promise<void> {
//     await Assets.load(REQUIRED_ASSETS);
//     await TypeIcon.load();
//     this.$pokemonStorageMenu = await Menu.init({
//       onSelect: (action) => this.onPokemonMenuSelect(action),
//       items: MENU_ITEMS.POKEMON_STORAGE,
//     });
//     this.$itemMenu = await Menu.init({
//       onSelect: (action) => this.onItemMenuSelect(action),
//       items: MENU_ITEMS.ITEM,
//     });
//     this.controls = Controls.selected();
//     this.controls.on('up', () => this.moveCursor('y', -1));
//     this.controls.on('down', () => this.moveCursor('y', 1));
//     this.controls.on('left', () => this.moveCursor('x', -1));
//     this.controls.on('right', () => this.moveCursor('x', 1));
//     this.controls.on('a', () => this.select());
//     this.controls.on('b', () => this.cancel());
//   }

//   onDestroy() {
//     this.controls.clear();
//   }

//   async afterRender() {
//     let pageNum = 0;
//     while (
//       pageNum <
//       Math.ceil(this.pokemonData.length / (STORAGE.NUM_COLS * STORAGE.NUM_ROWS))
//     ) {
//       const pagePokemonData = this.pokemonData.slice(
//         pageNum * STORAGE.PAGE_SIZE,
//         (pageNum + 1) * STORAGE.PAGE_SIZE
//       );
//       const page = new BoxPage();
//       await page.init(pagePokemonData);
//       this.pages.push(page);
//       page.render(this.container);
//       pageNum++;
//     }
//     await this.$boxCursor.init(this.pages[0], this.container);
//     this.$boxCursor.setTexture(
//       Texture.from(ASSETS.CURSOR_GRAB),
//       this.container
//     );
//   }

//   private moveCursor(axis: 'x' | 'y', distance: 1 | -1) {
//     if (this.$pokemonStorageMenu.isOpen) {
//       if (axis === 'x') {
//         return;
//       }
//       return this.$pokemonStorageMenu.moveCursor(distance);
//     } else if (this.$itemMenu.isOpen) {
//       if (axis === 'x') {
//         return;
//       }
//       return this.$itemMenu.moveCursor(distance);
//     } else if (this.$partyTray.isOpen) {
//       return this.movePartyCursor(axis, distance);
//     }
//     return this.moveBoxCursor(axis, distance);
//   }

//   private select() {
//     if (this.$pokemonStorageMenu.isOpen) {
//       return this.$pokemonStorageMenu.select();
//     } else if (this.$itemMenu.isOpen) {
//       return this.$itemMenu.select();
//     }
//     return this.selectSlot();
//   }

//   private cancel() {
//     if (this.$pokemonStorageMenu.isOpen) {
//       return this.$pokemonStorageMenu.close();
//     } else if (this.$itemMenu.isOpen) {
//       this.$pokemonStorageMenu.open(
//         this.$pokemonStorageMenu.position,
//         this.container
//       );
//       return this.$itemMenu.close();
//     } else if (this.$partyTray.isOpen) {
//       return this.$partyTray.close();
//     }
//   }

//   private async selectSlot() {
//     if (this.$boxCursor.hoveredSlot.gridLocation === 'party') {
//       await this.$partyTray.open(() =>
//         this.$boxCursor.moveToSlot(this.pages[this.activePageIndex].party)
//       );
//       const slot = this.$partyTray.firstSlot;
//       if (slot.pokemon) {
//         await this.$preview.update(slot.pokemon.data, this.container);
//       }
//       return this.$boxCursor.moveToSlot(this.$partyTray.firstSlot);
//     }
//     const slot = this.$boxCursor.getHoveredStorageSlot();
//     if (slot?.pokemon) {
//       const { x, y } = slot.position;
//       this.$pokemonStorageMenu.open(
//         { x: x + STORAGE.ICON_WIDTH, y },
//         this.container,
//         { pokemon: slot.pokemon.data }
//       );
//     }
//   }

//   private async moveBoxCursor(axis: 'x' | 'y', distance: 1 | -1) {
//     this.$boxCursor.moveInBox(axis, distance);
//     this.$preview.clear();
//     const slot = this.$boxCursor.getHoveredStorageSlot();
//     if (slot?.pokemon) {
//       await this.$preview.update(slot.pokemon.data, this.container);
//     }
//   }

//   private async onPokemonMenuSelect(
//     action: (typeof MENU_ITEMS.POKEMON_STORAGE)[number]
//   ) {
//     this.$pokemonStorageMenu.close();
//     switch (action) {
//       case 'WITHDRAW':
//         return this.withdrawPokemon();
//       case 'SUMMARY':
//         const summary = new SummaryScene();
//         await App.loadScene(summary);
//         this.controls.pause();
//         return summary.load({
//           pokemon: this.$pokemonStorageMenu.data.pokemon,
//           onClose: () => this.controls.resume(),
//         });
//       case 'ITEM':
//         return this.$itemMenu.open(
//           this.$pokemonStorageMenu.position,
//           this.container
//         );
//     }
//   }

//   private onItemMenuSelect(action: (typeof MENU_ITEMS.ITEM)[number]) {
//     switch (action) {
//       case 'TAKE':
//         break;
//       case 'GIVE':
//         break;
//       case 'BACK':
//         this.$pokemonStorageMenu.open(
//           this.$pokemonStorageMenu.position,
//           this.container
//         );
//         break;
//     }
//     this.$itemMenu.close();
//   }

//   private onPageChange(direction: 'next' | 'prev'): BoxPage {
//     const activePage = this.pages[this.activePageIndex];
//     const offset = direction === 'next' ? 1 : -1;
//     let nextPageNum = this.activePageIndex + offset;
//     let nextPage: BoxPage = this.pages[nextPageNum];
//     if (nextPageNum < 0) {
//       nextPage = this.pages[0];
//       nextPageNum = 0;
//     }
//     if (nextPageNum >= this.pages.length) {
//       nextPage = this.pages[this.pages.length - 1];
//       nextPageNum = this.pages.length - 1;
//     }
//     activePage.slide(direction === 'next' ? 'left' : 'right');
//     nextPage.slide(direction === 'next' ? 'right' : 'left');
//     this.activePageIndex = nextPageNum;
//     return nextPage;
//   }

//   private async withdrawPokemon() {
//     if (this.$partyTray.isPartyFull) {
//       return;
//     }
//     await this.$partyTray.addPokemon(this.$boxCursor, this.container);
//     return this.$preview.clear();
//   }
// }

type BoxStorageSignal = {
  hover: Pokemon | null;
  withdraw: Pokemon;
};

const menu = { width: 145, height: 290, x: 180 };

const x = 180;

export class BoxStorage extends Entity implements IContainer, ISignal {
  container = new Container(this);
  signal = new Signal<BoxStorageSignal>();
  private page: StoragePage;
  private cursor: StorageCursor;
  private menu: Menu;

  constructor(pokemon: Pokemon[]) {
    super();
    this.transform.set({ x });

    this.initPage(pokemon);
    this.initCursor();
    this.initMenu();

    this.container.add(this.page, this.cursor, this.menu);
  }

  private initPage(pokemon: Pokemon[]) {
    const firstPage = pokemon.slice(0, 30);
    this.page = new StoragePage(firstPage);
  }

  private initCursor() {
    this.cursor = new StorageCursor();

    this.cursor.signal.on('move', (event) => {
      const pokemon = this.page.grid.hoverPokemon(this.cursor, event);
      this.signal.emit('hover', pokemon);
    });

    this.cursor.signal.on('select', () => {
      console.log('select');
      this.menu.show();
    });
  }

  private initMenu() {
    const items = [
      { label: 'Summary', action: () => this.openSummary() },
      { label: 'Withdraw', action: () => this.withdrawPokemon() },
    ];

    this.menu = new Menu({
      rows: items.length,
      columns: 1,
      items,
      pausedControls: [this.cursor],
      ...menu,
    });
  }

  private openSummary() {}

  private withdrawPokemon() {}
}
