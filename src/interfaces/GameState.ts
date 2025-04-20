import { Upgrade } from './Upgrade';
import { Phases } from '../constants/phases';

export interface Die {
    value: number; // The rolled value of the die
    level: number; // The level of the die (1 = 6-sided, 2 = 8-sided, etc.)
}

export interface GameState {
    dice: Die[]; // Array of dice in the game
    highlights: Record<number, string>; // Mapping of die indices to highlight colors
    phase: Phases; // Current phase of the game (e.g., ROLL, SHOP, UPGRADE)
    points: number; // Total points accumulated
    rerollsLeft: number; // Number of rerolls left in the current round
    roundsPerCheckpoint: number; // Number of rounds per checkpoint
    checkpoint: number; // Current checkpoint number
    round: number; // Current round within the checkpoint
    required: number; // Points required to pass the current checkpoint
    gained: number; // Points gained in the last roll
    base: number; // Base score of the last roll
    multiplier: number; // Multiplier applied to the base score
    buyCost: number; // Cost to buy a new die
    upgradeCost: number; // Cost to upgrade a die
    availableUpgrades?: Upgrade[]; // List of available upgrades during the upgrade selection phase
}