export type Coordinate = { x: number; y: number };

export type MoveOptions = Partial<Coordinate & { speed: number }>;
