import { Graphics as PixiGraphics } from 'pixi.js';

export class Box {
  inner: PixiGraphics;

  constructor(width: number, height: number) {
    this.inner = new PixiGraphics().rect(0, 0, width, height);
  }
}
