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
    {
        id: 'upgrade_discount_20',
        name: 'Get a 20% discount on upgrading dice',
        rarity: UpgradeRarity.COMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            upgradeCost: Math.max(1, Math.floor(state.upgradeCost * 0.8)),
        }),
    },
    {
        id: 'upgrade_3_dice',
        name: 'Upgrade 3 random dice',
        rarity: UpgradeRarity.COMMON,
        apply: (state: GameState): GameState => {
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
        },
    },
    {
        id: 'level_boost_10',
        name: 'Reduce the points required for levels by 10%',
        rarity: UpgradeRarity.COMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            levelRequirement: Math.ceil(state.levelRequirement * 0.9),
        }),
    },
    {
        id: 'level_boost_15',
        name: 'Reduce the points required for levels by 15%',
        rarity: UpgradeRarity.UNCOMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            levelRequirement: Math.ceil(state.levelRequirement * 0.85),
        }),
    },
    {
        id: 'extra_dice_8',
        name: 'Get an extra 8-sided dice',
        rarity: UpgradeRarity.UNCOMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            dice: [
                ...state.dice,
                new Die(DiceLevels.LEVEL_2),
            ],
        }),
    },
    {
        id: 'reroll_bonus',
        name: 'Gain 1 extra reroll per round',
        rarity: UpgradeRarity.UNCOMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            maxRerolls: state.maxRerolls + 1,
        }),
    },
    {
        id: 'level_boost_20',
        name: 'Reduce the points required for levels by 20%',
        rarity: UpgradeRarity.UNCOMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            levelRequirement: Math.ceil(state.levelRequirement * 0.8),
        }),
    },
    {
        id: 'level_requirements_40',
        name: 'Reduce the points required for levels by 40%, but increase the cost of upgrading dice by 100%',
        rarity: UpgradeRarity.RARE,
        apply: (state: GameState): GameState => ({
            ...state,
            levelRequirement: Math.ceil(state.levelRequirement * 0.6),
            upgradeCost: Math.ceil(state.upgradeCost * 2),
        }),
    },
    {
        id: 'no_roll_1',
        name: 'Dice will not roll 1 anymore',
        rarity: UpgradeRarity.RARE,
        apply: (state: GameState): GameState => ({
            ...state,
            minimumRoll: 2,
        }),
    },
    {
        id: 'double_points',
        name: 'Triple your current points, but lose 1 reroll (if any)',
        rarity: UpgradeRarity.RARE,
        apply: (state: GameState): GameState => ({
            ...state,
            points: state.points * 3,
            rerollsLeft: Math.max(0, state.rerollsLeft - 1),
        }),
    },
    {
        id: 'bonus_round',
        name: 'Gain an extra round per level',
        rarity: UpgradeRarity.RARE,
        apply: (state: GameState): GameState => ({
            ...state,
            roundsPerLevel: state.roundsPerLevel + 1,
        }),
    },
    {
        id: 'all_dice_level',
        name: 'Upgrade all dice once',
        rarity: UpgradeRarity.RARE,
        apply: (state: GameState): GameState => {
            const newDice = state.dice.map((die) => die.upgradeLevel());
            return {
                ...state,
                dice: newDice,
            };
        },
    },
    {
        id: 'all_dice_level_2',
        name: 'Set all dice to level 12-sided dice',
        rarity: UpgradeRarity.EPIC,
        apply: (state: GameState): GameState => {
            const newDice = state.dice.map((die) => die.setLevel(DiceLevels.LEVEL_3));
            return {
                ...state,
                dice: newDice,
            };
        },
    },
    {
        id: 'dice_reset',
        name: 'Reset all dice to 6-sided dice, but gain 4 extra rerolls',
        rarity: UpgradeRarity.EPIC,
        apply: (state: GameState): GameState => {
            const newDice = state.dice.map((die) => die.resetLevel());
            return {
                ...state,
                dice: newDice,
                maxRerolls: state.maxRerolls + 4,
            };
        },
    },
    {
        id: 'max_dice',
        name: 'Upgrade all dice to max level, but have one less round per level',
        rarity: UpgradeRarity.LEGENDARY,
        apply: (state: GameState): GameState => {
            const newDice = state.dice.map(
                (die) => new Die(DiceLevels.LEVEL_5, die.color, die.multiplier)
            );
            return {
                ...state,
                dice: newDice,
                roundsPerLevel: Math.max(1, state.roundsPerLevel - 1),
            };
        },
    },
    {
        id: 'level_growth',
        name: 'Decrease the level growth multiplier by 10%',
        rarity: UpgradeRarity.LEGENDARY,
        apply: (state: GameState): GameState => ({
            ...state,
            levelMultiplier: Math.max(1, state.levelMultiplier * 0.9),
        }),
    },
];