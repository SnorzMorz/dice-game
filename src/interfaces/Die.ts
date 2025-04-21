import { DiceLevels } from "@/constants/diceLevels";

export interface Die {
    value: number; // The rolled value of the die
    level: DiceLevels; // The level of the die (e.g., 6, 8, 12, 20)
    color: string; // Optional color property for the die
    multiplier: number; // Multiplier for the die's value
}
