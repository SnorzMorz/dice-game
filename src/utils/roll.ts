export function roll(sides: number = 6): number {
    return Math.floor(Math.random() * sides) + 1;
}