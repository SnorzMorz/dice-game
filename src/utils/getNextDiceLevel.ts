import { DiceLevels } from "@/constants/diceLevels";

const ORDERED_DICE_LEVELS = [
    DiceLevels.LEVEL_1,
    DiceLevels.LEVEL_2,
    DiceLevels.LEVEL_3,
    DiceLevels.LEVEL_4,
];

export function getNextDiceLevel(currentLevel: DiceLevels): DiceLevels | null {
    const currentIndex = ORDERED_DICE_LEVELS.indexOf(currentLevel);
    const nextLevel = ORDERED_DICE_LEVELS[currentIndex + 1] || null;
    if (nextLevel === null) {
        return null;
    }
    return nextLevel;
}