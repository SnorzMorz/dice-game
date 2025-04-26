import { DiceLevels } from "@/constants/diceLevels";
import { getNextDiceLevel } from "@/utils/getNextDiceLevel";

export class Die {
    value: number;
    level: DiceLevels;
    color: string;
    multiplier: number;

    constructor(level: DiceLevels = DiceLevels.LEVEL_1, color: string = '#555', value?: number, multiplier: number = 1) {
        this.level = level;
        this.color = color;
        this.multiplier = multiplier;
        this.value = value !== undefined ? value : Math.floor(Math.random() * level.valueOf()) + 1;
        console.log(this.value, level, color, multiplier);
    }

    // Returns a new Die instance with a rolled value
    roll(): Die {
        return new Die(this.level, this.color, undefined, this.multiplier);
    }

    // Returns a new Die instance with an upgraded level (if possible)
    upgradeLevel(): Die {
        const nextLevel = getNextDiceLevel(this.level);
        if (!nextLevel) {
            return this; // No upgrade possible, return the same instance
        }
        return new Die(nextLevel, this.color, undefined, this.multiplier);
    }

    // Returns a new Die instance with the level reset to LEVEL_1
    resetLevel(): Die {
        return new Die(DiceLevels.LEVEL_1, this.color, undefined, this.multiplier);
    }

    // Returns a new Die instance with the color reset to the default
    resetColor(): Die {
        return new Die(this.level, '#555', this.value, this.multiplier);
    }

    setColor(color: string): Die {
        return new Die(this.level, color, this.value, this.multiplier);
    }

    // Determines if the die can be upgraded
    canUpgrade(): boolean {
        return this.level < DiceLevels.LEVEL_4;
    }

    setLevel(level: DiceLevels): Die {
        return new Die(level, this.color, undefined, this.multiplier);
    }
}