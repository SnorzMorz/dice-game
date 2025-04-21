import { roll } from '../../utils/roll';
import { Upgrade } from '@/interfaces/Upgrade';
import { GameState } from '@/interfaces/GameState';
import { UpgradeRarity } from './upgradeRarity';
import { DiceLevels } from '@/constants/diceLevels';
import { DEFAULT_COLOR } from '../diceColors';

export const upgrades: Upgrade[] = [
    {
        id: 'extra_dice_6',
        name: 'Get an extra 6-sided dice',
        rarity: UpgradeRarity.COMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            dice: [
                ...state.dice,
                { value: roll(DiceLevels.LEVEL_1), level: DiceLevels.LEVEL_1, color: DEFAULT_COLOR, multiplier: 1 },
            ],
        }),
    },
    {
        id: 'buy_discount_10',
        name: 'Get a 10% discount on buying new dice',
        rarity: UpgradeRarity.COMMON,
        apply: (state: GameState): GameState => ({
            ...state,
            buyCost: Math.max(1, Math.floor(state.buyCost * 0.9)),
        }),
    },
    {
        id: 'upgrade_3_dice',
        name: 'Upgrade 3 random dice',
        rarity: UpgradeRarity.COMMON,
        apply: (state: GameState): GameState => {
            const upgradableDice = state.dice.filter((die) => die.level < DiceLevels.LEVEL_5);
            const diceToUpgrade = upgradableDice.slice(0, 3);
            const upgradedDice = state.dice.map((die) =>
                diceToUpgrade.includes(die)
                    ? { ...die, level: die.level + 1, value: roll(die.level + 1) }
                    : die
            );
            return { ...state, dice: upgradedDice };
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
                { value: roll(DiceLevels.LEVEL_2), level: DiceLevels.LEVEL_2, color: DEFAULT_COLOR, multiplier: 1 },
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
        id: 'double_points',
        name: 'Double your current points, but lose 1 reroll (if any)',
        rarity: UpgradeRarity.RARE,
        apply: (state: GameState): GameState => ({
            ...state,
            points: state.points * 2,
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
        id: 'dice_reset',
        name: 'Reset all dice to level 1, but gain 2 extra rerolls',
        rarity: UpgradeRarity.EPIC,
        apply: (state: GameState): GameState => ({
            ...state,
            dice: state.dice.map((die) => ({ ...die, level: DiceLevels.LEVEL_1, value: roll(DiceLevels.LEVEL_1) })),
            rerollsLeft: state.rerollsLeft + 3,
        }),
    },
    {
        id: 'max_dice',
        name: 'Upgrade all dice to max level, but have one less round per checkpoint',
        rarity: UpgradeRarity.LEGENDARY,
        apply: (state: GameState): GameState => ({
            ...state,
            dice: state.dice.map((die) => ({ ...die, level: DiceLevels.LEVEL_5, value: roll(DiceLevels.LEVEL_5) })),
            roundsPerCheckpoint: Math.max(1, state.roundsPerCheckpoint - 1),
        }),
    },
];