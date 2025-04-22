import { DiceLevels } from "@/constants/diceLevels";
import { getNextDiceLevel } from "@/utils/getNextDiceLevel";
import { roll } from "@/utils/roll";

export class Die {
    value: number;
    level: DiceLevels;
    color: string;
    multiplier: number;

    constructor(level: DiceLevels = DiceLevels.LEVEL_1, color: string = '#555', multiplier: number = 1) {
        this.level = level;
        this.color = color;
        this.multiplier = multiplier;
        this.value = Math.floor(Math.random() * this.level.valueOf()) + 1;
    }

    roll(): void {
        this.value = Math.floor(Math.random() * this.level.valueOf()) + 1;
    }

    upgradeLevel(): void {
        const nextLevel = getNextDiceLevel(this.level);
        if (nextLevel) {
            this.level = nextLevel;
            this.roll();
        }
    }

    canUpgrade(): boolean {
        return this.level < DiceLevels.LEVEL_4;
    }

    resetLevel(): void {
        this.level = DiceLevels.LEVEL_1;
    }

    resetColor(): void {
        this.color = '#555'; // Reset to default color
    }
}