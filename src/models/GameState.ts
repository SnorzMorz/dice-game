import { Upgrade } from './Upgrade';
import { Phases } from '../constants/phases';
import { Die } from './Die';

export interface GameState {
    dice: Die[]; // Array of dice in the game
    phase: Phases; // Current phase of the game (e.g., ROLL, SHOP, UPGRADE)
    points: number; // Total points accumulated
    rerollsLeft: number; // Number of rerolls left in the current round
    maxRerolls: number; // Maximum number of rerolls allowed in a round
    roundsPerLevel: number; // Number of rounds per level
    level: number; // Current level number
    levelMultiplier: number; // Multiplier for the next level
    round: number; // Current round within the level
    levelRequirement: number; // Points required to pass the current level
    gained: number; // Points gained in the last roll
    base: number; // Base score of the last roll
    multiplier: number; // Multiplier applied to the base score
    buyCost: number; // Cost to buy a new die
    buyMultiplier: number; // Multiplier for the cost of buying a die
    upgradeDiceCost: number; // Cost to upgrade a die
    upgradeDiceMultiplier: number; // Multiplier for the cost of upgrading a die
    availableUpgrades: Upgrade[]; // List of available upgrades during the upgrade selection phase
    upgradeCost: number; // Global upgrade cost
    minimumRoll: number; // Minimum roll value for all dice
    maximumRoll: number; // Maximum roll value for all dice
}