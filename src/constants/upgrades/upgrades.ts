import { roll } from '../../utils/roll';
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
        'buy_discount_10',
        'Get a 10% discount on buying new dice',
        UpgradeRarity.COMMON,
        (state: GameState): GameState => ({
            ...state,
            buyCost: Math.max(1, Math.floor(state.buyCost * 0.9)),
        }),
    ),
    {
        id: 'upgrade_discount_15',
        name: 'Get a 15% discount on upgrading dice',
        rarity: UpgradeRarity.COMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            upgradeCost: Math.max(1, Math.floor(state.buyCost * 0.85)),
        }),
    },
    {
        id: 'checkpoint_boost',
        name: 'Reduce the points required for checkpoints by 10%',
        rarity: UpgradeRarity.UNCOMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            checkpointRequirement: Math.ceil(state.checkpointRequirement * 0.9),
        }),
    },
    {
        id: 'upgrade_3_dice',
        name: 'Upgrade 3 random dice',
        rarity: UpgradeRarity.COMMON,
        apply: (state: GameState): GameState => {
            const upgradableDice = state.dice.filter((die) => die.canUpgrade());
            if (upgradableDice.length < 3) {
                return state;
            }
            const diceToUpgrade = upgradableDice.sort(() => 0.5 - Math.random()).slice(0, 3);
            diceToUpgrade.forEach((die) => {
                die.upgradeLevel();
            });
            return state;
        },
    },
    {
        id: 'extra_dice_8',
        name: 'Get an extra 8-sided dice',
        rarity: UpgradeRarity.UNCOMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            dice: [
                ...state.dice,
                new Die(DiceLevels.LEVEL_2,),
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
        id: 'checkpoint_boost',
        name: 'Reduce the points required for checkpoints by 20%',
        rarity: UpgradeRarity.UNCOMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            checkpointRequirement: Math.ceil(state.checkpointRequirement * 0.8),
        }),
    },
    {
        id: 'checkpoint_requirements_40',
        name: 'Reduce the points required for checkpoints by 40%, but increase the cost of upgrading dice by 100%',
        rarity: UpgradeRarity.RARE,
        apply: (state: GameState): GameState => ({
            ...state,
            checkpointRequirement: Math.ceil(state.checkpointRequirement * 0.6),
            upgradeCost: Math.ceil(state.upgradeCost * 1.4),
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
        name: 'Gain an extra round per checkpoint',
        rarity: UpgradeRarity.RARE,
        apply: (state: GameState): GameState => ({
            ...state,
            roundsPerCheckpoint: state.roundsPerCheckpoint + 1,
        }),
    },
    {
        id: 'all_dice_level',
        name: 'Upgrade all dice by 1 level',
        rarity: UpgradeRarity.RARE,
        apply: (state: GameState): GameState => {
            state.dice.forEach((die) => {
                die.upgradeLevel();
            });
            return state;
        },
    },
    {
        id: 'dice_reset',
        name: 'Reset all dice to level 1, but gain 2 extra rerolls',
        rarity: UpgradeRarity.EPIC,
        apply: (state: GameState): GameState => {
            state.dice.forEach((die) => {
                die.resetLevel();
            })
            return {
                ...state,
                maxRerolls: state.maxRerolls + 2,
            };
        }
    },
    {
        id: 'dice_reset',
        name: 'Reset all dice to level 1, but gain 3 extra rerolls',
        rarity: UpgradeRarity.EPIC,
        apply: (state: GameState): GameState => {
            state.dice.forEach((die) => {
                die.resetLevel();
            })
            return {
                ...state,
                maxRerolls: state.maxRerolls + 3,
            };
        }
    },
    {
        id: 'max_dice',
        name: 'Upgrade all dice to max level, but have one less round per checkpoint',
        rarity: UpgradeRarity.LEGENDARY,
        apply: (state: GameState): GameState => {
            state.dice.forEach((die) => {
                die.level = DiceLevels.LEVEL_5;
                die.value = roll(DiceLevels.LEVEL_5);
            });
            return {
                ...state,
                roundsPerCheckpoint: Math.max(1, state.roundsPerCheckpoint - 1),
            };
        },
    },
    {
        id: 'checkpoint_growth',
        name: 'Decrease the checkpoint growth multiplier by 20%',
        rarity: UpgradeRarity.LEGENDARY,
        apply: (state: GameState): GameState => {
            return {
                ...state,
                checkpointMultiplier: Math.max(1, state.checkpointMultiplier * 0.8),
            };
        },
    },
];