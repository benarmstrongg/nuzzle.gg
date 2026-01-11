// import { Assets, ContainerOptions, Texture } from 'pixi.js';
// import { App, ContainerObject, SpriteObject, TextObject } from '../engine';
// import { font } from '../util/font.util';

// const ASSET = 'sprites/ui/common/message_box.png';
// const DEFAULT_CLOSE_DELAY_MS = 500;

// type MessageBoxDisplayOptions = {
//     closeAfterComplete?: boolean;
//     closeDelayMs?: number;
// };

// export class MessageBox extends ContainerObject {
//     private $box = new SpriteObject();
//     private $text: TextObject = new TextObject({
//         style: font({ size: 'xlarge' }),
//         position: { x: 20, y: 20 },
//     });
//     private isReady = true;

//     constructor(opts: ContainerOptions) {
//         super({
//             ...opts,
//             position: opts.position ?? { x: 0, y: 192 },
//             zIndex: opts.zIndex ?? 100,
//             visible: false,
//         });
//     }

//     async init() {
//         await Assets.load(ASSET);
//         this.$box.setTexture(Texture.from(ASSET), this);
//     }

//     async displayMessage(message?: string, opts?: MessageBoxDisplayOptions) {
//         if (!message) {
//             return;
//         }
//         return new Promise<void>((res) => {
//             this.$text.setText('', this);
//             this.visible = true;
//             let i = 0;
//             App.tick(async (done) => {
//                 if (!this.isReady) {
//                     return;
//                 }
//                 if (i === message.length) {
//                     if (opts?.closeAfterComplete) {
//                         done();
//                         await App.wait(
//                             opts.closeDelayMs ?? DEFAULT_CLOSE_DELAY_MS
//                         );
//                         this.visible = false;
//                         return res();
//                     }
//                     done();
//                     return res();
//                 }
//                 const nextMessage = this.$text.text + message[i];
//                 this.$text.setText(nextMessage, this);
//                 i++;
//                 this.isReady = false;
//                 await App.wait(20);
//                 this.isReady = true;
//             });
//         });
//     }

//     close() {
//         this.visible = false;
//     }

//     continue() {}
// }
