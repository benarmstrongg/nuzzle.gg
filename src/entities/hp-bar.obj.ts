// import { Spritesheet } from 'pixi.js';
// import { App, ContainerObject, SpriteObject } from '../engine';
// import { loadSpritesheet } from '../util/assets.util';

// const ASSET = 'spritesheets/hp_bar.png';
// const SPRITESHEET_HEIGHT = 18;
// const w = 96;
// const h = 6;

// const FRAMES = {
//     green: { frame: { x: 0, y: 0, w, h } },
//     yellow: { frame: { x: 0, y: h, w, h } },
//     red: { frame: { x: 0, y: h * 2, w, h } },
// };

// export class HpBar extends SpriteObject {
//     private static spritesheet: Spritesheet;

//     static async load() {
//         if (HpBar.spritesheet) {
//             return;
//         }
//         HpBar.spritesheet = await loadSpritesheet(
//             ASSET,
//             FRAMES,
//             w,
//             SPRITESHEET_HEIGHT
//         );
//     }

//     setHp(targetPercent: number, animate: boolean, container: ContainerObject) {
//         if (
//             animate &&
//             Math.round(this.scale.x * 10_000) ===
//                 Math.round(targetPercent * 10_000)
//         ) {
//             return;
//         }
//         const isIncreasing = targetPercent >= this.scale.x;
//         const stepMagnitude = Math.abs(this.scale.x - targetPercent) / 10;
//         const stepWidth = isIncreasing ? stepMagnitude : -stepMagnitude;
//         const min = targetPercent === 0 ? 0 : 0.011;
//         console.log(targetPercent, animate, this.scale.x);
//         return new Promise<void>((res) => {
//             App.tick((done) => {
//                 if (!animate) {
//                     this.scale.x = targetPercent;
//                     this.setBarTexture(targetPercent, container);
//                     done();
//                     return res();
//                 }
//                 const nextScale = this.scale.x + stepWidth;
//                 this.scale.x = isIncreasing
//                     ? Math.min(1, nextScale)
//                     : Math.max(min, nextScale);
//                 this.setBarTexture(this.scale.x, container);
//                 const isDone = isIncreasing
//                     ? this.scale.x >= targetPercent
//                     : this.scale.x <= targetPercent;
//                 if (isDone) {
//                     done();
//                     return res();
//                 }
//             });
//         });
//     }

//     private setBarTexture(hpPercent: number, container: ContainerObject) {
//         const texture =
//             hpPercent > 0.5
//                 ? HpBar.spritesheet.textures.green
//                 : hpPercent > 0.25
//                 ? HpBar.spritesheet.textures.yellow
//                 : HpBar.spritesheet.textures.red;
//         this.setTexture(texture, container);
//     }
// }
