import {
  Container,
  Entity,
  FontSize,
  IContainer,
  IControls,
  TransformState,
} from '../../engine';

type MenuItem = {
  label: string;
  action: () => void;
};

type MenuOptions = Partial<TransformState> & {
  items: MenuItem[];
  rows: number;
  columns: number;
  fontSize?: FontSize;
  pausedControls?: IControls[];
};

export class Menu extends Entity implements IContainer {
  container = new Container(this);
  private pausedControls: IControls[];

  constructor(options: MenuOptions) {
    super();

    // this.visible = false;

    const { pausedControls, x, y, width, height } = options;

    this.transform.set({ x, y, width, height });

    const bg = this.initBackground(options);
    const cursor = this.initCursor(options);
    const items = this.initItems(options);

    this.container.add(bg, cursor, items);

    this.pausedControls = pausedControls ?? [];
  }

  private initBackground(options: MenuOptions) {
    const { width, height } = options;

    const assetUrl =
      (height ?? 0) > (width ?? 0)
        ? 'sprites/ui/menu/bg-v.png'
        : 'sprites/ui/menu/bg-h.png';

    return Entity.sprite({
      assetUrl,
      transform: { height, width },
    });
  }

  private initCursor(options: MenuOptions) {
    const { width } = options;

    return Entity.sprite({
      assetUrl: 'sprites/ui/menu/cursor.png',
      transform: {
        width: width ? width - 32 : undefined,

        // TODO: fix hard code
        x: 16,
        y: 18,
      },
    });
  }

  private initItems(options: MenuOptions) {
    const { items, rows, columns, width, height, fontSize } = options;

    const menuItems = items.map((item) =>
      Entity.text(item.label, { size: fontSize ?? 'md' })
    );

    return Entity.container.grid(
      {
        rows,
        columns,
        width,
        // height,

        // TODO: fix hard code
        x: 20,
        y: 20,
      },
      ...menuItems
    );
  }

  show() {
    this.visible = true;
    this.pausedControls.forEach(({ controls }) => controls.pause());
  }

  hide() {
    this.visible = false;
    this.pausedControls.forEach(({ controls }) => controls.resume());
  }
}
