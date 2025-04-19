import { roll } from './roll';
import { Upgrade } from '@/interfaces/Upgrade';
import { GameState } from '@/interfaces/GameState';

export const upgrades: Upgrade[] = [
    {
        id: 'extra_dice',
        name: 'Get an extra 6-sided dice',
        rarity: 1,
        apply: (state: GameState): GameState => ({
            ...state,
            dice: [...state.dice, { value: roll(6), level: 1 }],
        }),
    },
    {
        id: 'upgrade_2_dice',
        name: 'Upgrade 2 random dice by 1 Level',
        rarity: 1,
        apply: (state: GameState): GameState => {
            const upgradableDice = state.dice.filter(die => die.level < 4);
            const diceToUpgrade = upgradableDice.slice(0, 2); // Pick the first 2 dice
            const upgradedDice = state.dice.map(die =>
                diceToUpgrade.includes(die)
                    ? { ...die, level: die.level + 1, value: roll([6, 8, 10, 20][die.level]) }
                    : die
            );
            return { ...state, dice: upgradedDice };
        },
    },
    {
        id: 'reset_to_level_1',
        name: 'Decrease all dice to level 1, but get 2 extra 12-sided dice',
        rarity: 2,
        apply: (state: GameState): GameState => ({
            ...state,
            dice: [
                ...state.dice.map(die => ({ ...die, level: 1, value: roll(6) })),
                { value: roll(12), level: 3 },
                { value: roll(12), level: 3 },
            ],
        }),
    },
    {
        id: 'decrease_buy_cost',
        name: 'Decrease the cost of buying new dice by 25%',
        rarity: 1,
        apply: (state: GameState): GameState => ({
            ...state,
            buyCost: Math.max(1, Math.floor(state.buyCost * 0.75)), // Reduce buy cost by 25%, minimum 1
        }),
    },
    {
        id: 'decrease_upgrade_cost',
        name: 'Decrease the cost of upgrading dice by 25%',
        rarity: 1,
        apply: (state: GameState): GameState => ({
            ...state,
            upgradeCost: Math.max(1, Math.floor(state.upgradeCost * 0.75)), // Reduce upgrade cost by 25%, minimum 1
        }),
    },
];