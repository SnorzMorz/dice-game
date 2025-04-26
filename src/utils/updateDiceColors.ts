import { DICE_COMBO_COLORS } from "@/constants/diceColors";
import { Die } from "@/models/Die";

export function updateDiceColors(dice: Die[]): Die[] {
    let colorIndex = 0;
    const updatedDice: Die[] = [];
    const groups: Record<number, Die[]> = {};
    dice.forEach((die) => (groups[die.value] ??= []).push(die));

    console.log(groups);

    Object.values(groups).forEach((diceGroup) => {
        if (diceGroup.length >= 2) {
            const color = DICE_COMBO_COLORS[colorIndex % DICE_COMBO_COLORS.length];
            colorIndex += 1;
            diceGroup.forEach((die) => {
                updatedDice.push(die.setColor(color));
            });
        } else {
            diceGroup.forEach((die) => {
                updatedDice.push(die.resetColor());
            });
        }
    });

    return updatedDice;
}