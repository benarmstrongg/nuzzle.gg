export class Random {
  static int(max: number): number;
  static int(min: number, max: number): number;
  static int(minOrMax: number = 0, max?: number) {
    if (typeof max !== 'number') {
      max = minOrMax;
      minOrMax = 0;
    }
    return minOrMax + Math.floor(Math.random() * (max - minOrMax + 1));
  }
}
