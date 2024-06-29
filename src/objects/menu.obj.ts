import { Assets, Container, PointData, Rectangle, Texture } from 'pixi.js';
import { ContainerObject, SpriteObject, TextObject } from '../engine';
import { font } from '../util/font.util';

const ASSETS = {
    BG: 'assets/sprites/ui/menu/bg.png',
    CURSOR: 'assets/sprites/ui/menu/cursor.png',
};

type MenuOptions<TItems extends readonly string[]> = {
    items: TItems;
    onSelect: (action: TItems[number]) => void;
};

export class Menu<TItems extends readonly string[]> extends ContainerObject {
    private $bg: SpriteObject;
    private $cursor: SpriteObject<{ selectedItem: TItems[number] }>;
    private $items: ContainerObject<{}, TextObject>;
    private onSelect: (action: TItems[number]) => void;
    items: TItems;
    isOpen = false;

    private constructor(opts: MenuOptions<TItems>) {
        super();
        this.items = opts.items;
        this.onSelect = opts.onSelect;
    }

    static async init<TItems extends readonly string[]>(
        opts: MenuOptions<TItems>
    ): Promise<Menu<TItems>> {
        await Assets.load([ASSETS.BG, ASSETS.CURSOR]);
        const scaleY = opts.items.length / 3;
        const menu = new Menu<TItems>(opts);
        menu.$bg = new SpriteObject({
            height: scaleY,
            width: 0.6,
        });
        menu.$bg.setTexture(
            new Texture({
                frame: new Rectangle(4, 0, 252, 96),
                source: Assets.get(ASSETS.BG),
            }),
            menu
        );
        menu.$items = new ContainerObject({
            children: opts.items.map(
                (item, i) =>
                    new TextObject({
                        style: font('medium'),
                        text: item,
                        x: 15,
                        y: 20 * scaleY + i * 20,
                    })
            ),
        });
        menu.$cursor = new SpriteObject({
            height: 0.65,
            width: 0.4,
            x: 10,
            y: 17 * scaleY,
            data: { selectedItem: opts.items[0] },
        });
        menu.$cursor.setTexture(Texture.from(ASSETS.CURSOR), menu);
        menu.addChild(menu.$bg, menu.$cursor, menu.$items);
        return menu;
    }

    open(position: PointData, container: Container) {
        this.position = position;
        this.render(container);
        this.isOpen = true;
    }

    close() {
        this.removeFromParent();
        this.isOpen = false;
    }

    moveCursor(distance: 1 | -1) {
        let nextIndex: number;
        if (
            this.$cursor.data.selectedItem === this.items[0] &&
            distance === -1
        ) {
            nextIndex = this.$items.children.length - 1;
        } else if (
            this.$cursor.data.selectedItem ===
                this.items[this.items.length - 1] &&
            distance === 1
        ) {
            nextIndex = 0;
        } else {
            const selectedIndex = this.$items.children.findIndex(
                (opt) =>
                    (opt as TextObject).text === this.$cursor.data.selectedItem
            );
            nextIndex = selectedIndex + distance;
        }
        this.$cursor.position.y =
            this.$items.children[nextIndex].position.y - 3;
        this.$cursor.data.selectedItem = this.items[nextIndex];
    }

    select() {
        this.onSelect(this.$cursor.data.selectedItem);
    }
}