import { DiceLevels } from "@/constants/diceLevels";
import { getNextDiceLevel } from "@/utils/getNextDiceLevel";

export class Die {
    readonly value: number;

    constructor(
        public readonly level: DiceLevels = DiceLevels.LEVEL_1,
        public readonly color: string = '#555',
        private readonly _value?: number,
        public readonly multiplier: number = 1,
        maximumRoll: number = DiceLevels.LEVEL_5.valueOf(),
        minimumRoll: number = 1
    ) {
        this.level = level;
        const levelMaxRoll = this.level.valueOf();
        const effectiveMaxRoll = Math.min(levelMaxRoll, maximumRoll);
        this.color = color;
        this.multiplier = multiplier;
        this.value = _value !== undefined
            ? _value
            : Math.floor(Math.random() * (effectiveMaxRoll - minimumRoll + 1)) + minimumRoll;
    }


    // Returns a new Die instance with a rolled value
    roll(minimumRoll: number, maximumRoll: number): Die {
        return new Die(this.level, this.color, undefined, this.multiplier, maximumRoll, minimumRoll);
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