import { Die } from "@/models/Die";

export function calculateRollStats(dice: Die[]): {
    base: number;
    total: number;
    groups: Record<number, Die[]>;
} {
    const base = dice.reduce((acc, die) => acc + die.value, 0);
    const freq: Record<number, Die[]> = {};
    dice.forEach((die) => (freq[die.value] ??= []).push(die));

    let total = 0;
    Object.entries(freq).forEach(([value, diceGroup]) => {
        const groupBase = diceGroup.reduce((acc, die) => acc + die.value, 0);
        total += groupBase * diceGroup.length;
    });

    return { base, total, groups: freq };
}