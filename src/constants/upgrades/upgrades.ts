import { Upgrade } from '@/models/Upgrade';
import { GameState } from '@/models/GameState';
import { UpgradeRarity } from './upgradeRarity';
import { DiceLevels } from '@/constants/diceLevels';
import { Die } from '@/models/Die';

export const upgrades: Upgrade[] = [
    new Upgrade(
        'extra_dice_6',
        'Get an extra 6-sided dice',
        UpgradeRarity.COMMON,
        (state: GameState): GameState => ({
            ...state,
            dice: [
                ...state.dice,
                new Die(),
            ],
        })
    ),
    new Upgrade(
        'buy_discount_20',
        'Get a 20% discount on buying new dice',
        UpgradeRarity.COMMON,
        (state: GameState): GameState => ({
            ...state,
            buyCost: Math.max(1, Math.floor(state.buyCost * 0.8)),
        })
    ),
    new Upgrade(
        'upgrade_discount_20',
        'Get a 20% discount on upgrading dice',
        UpgradeRarity.COMMON,
        (state: GameState): GameState => ({
            ...state,
            upgradeDiceCost: Math.max(1, Math.floor(state.upgradeDiceCost * 0.8)),
        })
    ),
    new Upgrade(
        'upgrade_3_dice',
        'Upgrade 3 random dice',
        UpgradeRarity.COMMON,
        (state: GameState): GameState => {
            const upgradableDice = state.dice.filter((die) => die.canUpgrade());
            const diceToUpgrade = upgradableDice
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            const newDice = state.dice.map((die) =>
                diceToUpgrade.includes(die) ? die.upgradeLevel() : die
            );

            return {
                ...state,
                dice: newDice,
            };
        }
    ),
    new Upgrade(
        'level_boost_10',
        'Reduce the points required for levels by 10%',
        UpgradeRarity.COMMON,
        (state: GameState): GameState => ({
            ...state,
            levelRequirement: Math.ceil(state.levelRequirement * 0.9),
        })
    ),
    new Upgrade(
        'level_boost_15',
        'Reduce the points required for levels by 15%',
        UpgradeRarity.UNCOMMON,
        (state: GameState): GameState => ({
            ...state,
            levelRequirement: Math.ceil(state.levelRequirement * 0.85),
        })
    ),
    new Upgrade(
        'extra_dice_8',
        'Get an extra 8-sided dice',
        UpgradeRarity.UNCOMMON,
        (state: GameState): GameState => ({
            ...state,
            dice: [
                ...state.dice,
                new Die(DiceLevels.LEVEL_2),
            ],
        })
    ),
    new Upgrade(
        'reroll_bonus',
        'Gain 1 extra reroll per round',
        UpgradeRarity.UNCOMMON,
        (state: GameState): GameState => ({
            ...state,
            maxRerolls: state.maxRerolls + 1,
        })
    ),
    new Upgrade(
        'level_boost_20',
        'Reduce the points required for levels by 20%',
        UpgradeRarity.UNCOMMON,
        (state: GameState): GameState => ({
            ...state,
            levelRequirement: Math.ceil(state.levelRequirement * 0.8),
        })
    ),
    new Upgrade(
        'level_requirements_40',
        'Reduce the points required for levels by 40%, but increase the cost of upgrading dice by 100%',
        UpgradeRarity.RARE,
        (state: GameState): GameState => ({
            ...state,
            levelRequirement: Math.ceil(state.levelRequirement * 0.6),
            upgradeDiceCost: Math.ceil(state.upgradeDiceCost * 2),
        })
    ),
    new Upgrade(
        'no_roll_1',
        'Dice will not roll 1 anymore',
        UpgradeRarity.RARE,
        (state: GameState): GameState => ({
            ...state,
            minimumRoll: 2,
        })
    ),
    new Upgrade(
        'double_points',
        'Triple your current points, but lose 1 reroll (if any)',
        UpgradeRarity.RARE,
        (state: GameState): GameState => ({
            ...state,
            points: state.points * 3,
            rerollsLeft: Math.max(0, state.rerollsLeft - 1),
        })
    ),
    new Upgrade(
        'bonus_round',
        'Gain an extra round per level',
        UpgradeRarity.RARE,
        (state: GameState): GameState => ({
            ...state,
            roundsPerLevel: state.roundsPerLevel + 1,
        })
    ),
    new Upgrade(
        'all_dice_level',
        'Upgrade all dice once',
        UpgradeRarity.RARE,
        (state: GameState): GameState => {
            const newDice = state.dice.map((die) => die.upgradeLevel());
            return {
                ...state,
                dice: newDice,
            };
        }
    ),
    new Upgrade(
        'all_dice_level_2',
        'Set all dice to level 12-sided dice',
        UpgradeRarity.EPIC,
        (state: GameState): GameState => {
            const newDice = state.dice.map((die) => die.setLevel(DiceLevels.LEVEL_3));
            return {
                ...state,
                dice: newDice,
            };
        }
    ),
    new Upgrade(
        'dice_reset',
        'Reset all dice to 6-sided dice, but gain 4 extra rerolls',
        UpgradeRarity.EPIC,
        (state: GameState): GameState => {
            const newDice = state.dice.map((die) => die.resetLevel());
            return {
                ...state,
                dice: newDice,
                maxRerolls: state.maxRerolls + 4,
            };
        }
    ),
    new Upgrade(
        'max_dice',
        'Upgrade all dice to max level, but have one less round per level',
        UpgradeRarity.LEGENDARY,
        (state: GameState): GameState => {
            const newDice = state.dice.map(
                (die) => new Die(DiceLevels.LEVEL_5, die.color, die.multiplier)
            );
            return {
                ...state,
                dice: newDice,
                roundsPerLevel: Math.max(1, state.roundsPerLevel - 1),
            };
        }
    ),
    new Upgrade(
        'level_growth',
        'Decrease the level growth multiplier by 10%',
        UpgradeRarity.LEGENDARY,
        (state: GameState): GameState => ({
            ...state,
            levelMultiplier: Math.max(1, state.levelMultiplier * 0.9),
        })
    ),
];