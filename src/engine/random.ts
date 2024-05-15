function randomInt(max: number): number;
function randomInt(min: number, max: number): number;
function randomInt(minOrMax: number = 0, max: number = -1) {
    if (max === -1) {
        max = minOrMax;
        minOrMax = 0;
    }
    return minOrMax + Math.floor(Math.random() * (max - minOrMax + 1));
}

export const Random = {
    int: randomInt,
};
