import { roll } from './roll.js';

export const upgrades = [
    {
        id: 'extra_dice',
        name: 'Get 2 extra 6-sided dice',
        rarity: 'common',
        apply: (state) => ({
            ...state,
            dice: [...state.dice, { value: roll(6), level: 1 }, { value: roll(6), level: 1 }],
        }),
    },
    {
        id: 'upgrade_to_max',
        name: 'Upgrade 2 random dice to max level',
        rarity: 'common',
        apply: (state) => {
            const levels = [6, 8, 10, 20];
            const upgradableDice = state.dice.filter(die => die.level < levels.length);
            const diceToUpgrade = upgradableDice.slice(0, 2); // Pick the first 2 dice
            const upgradedDice = state.dice.map(die =>
                diceToUpgrade.includes(die)
                    ? { ...die, level: levels.length, value: roll(20) }
                    : die
            );
            return { ...state, dice: upgradedDice };
        },
    },
    {
        id: 'reset_to_level_1',
        name: 'Decrease all dice to level 1, but get 2 extra 12-sided dice',
        rarity: 'uncommon',
        apply: (state) => ({
            ...state,
            dice: [
                ...state.dice.map(die => ({ ...die, level: 1, value: roll(6) })),
                { value: roll(12), level: 3 },
                { value: roll(12), level: 3 },
            ],
        }),
    },
];