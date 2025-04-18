//////////////////////// src/GameEngine.js ////////////////////////
import { roll } from './utils/roll';

export const ROLLS_PER_CHECK = 5;
export const START_CHECKPOINT_POINTS = 15;
const CHECK_GROWTH = 1.5;
const INITIAL_BUY_COST = 10;
export const GROUP_COLOURS = [
    '#22c55e', // green
    '#f59e0b', // amber
    '#0ea5e9', // sky
    '#e879f9', // fuchsia
    '#f87171', // red
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#facc15', // yellow
];

function requiredForCheckpoint(cp) {
    return Math.ceil(START_CHECKPOINT_POINTS * Math.pow(CHECK_GROWTH, cp - 1));
}

function analyseRoll(dice) {
    const base = dice.reduce((a, b) => a + b, 0);
    const freq = {};
    dice.forEach((v, i) => (freq[v] ??= []).push(i));

    let multiplier = 1;
    const highlight = {};
    let colour = 0;

    Object.values(freq).forEach(idxArr => {
        if (idxArr.length >= 2) {
            multiplier *= idxArr.length;
            const c = GROUP_COLOURS[colour % GROUP_COLOURS.length];
            colour += 1;
            idxArr.forEach(i => (highlight[i] = c));
        }
    });
    return { base, multiplier, total: base * multiplier, highlights: highlight };
}

export function initialState() {
    const initialDice = [{ value: roll(), level: 1 }]; // Each die starts at level 1 (6 sides)
    const { highlights } = analyseRoll(initialDice.map(die => die.value));

    return {
        dice: initialDice,
        highlights, // Set the highlights for the initial roll
        phase: 'ROLL',
        points: 0,
        rerollsLeft: 2,
        checkpoint: 1,
        round: 1,
        required: requiredForCheckpoint(1),
        gained: 0,
        base: 0,
        multiplier: 1,
        buyCost: INITIAL_BUY_COST,
        upgradeCost: 10, // Initial cost for upgrading a die
    };
}

export function reducer(state, action) {
    console.log('Action:', action); // Log the action
    console.log('State before:', state); // Log the state before the action
    switch (action.type) {
        case 'ROLL': {
            if (state.rerollsLeft <= 0) return state;
            const newDice = state.dice.map(die => ({
                ...die,
                value: roll([6, 8, 12, 20][die.level - 1]), // Roll based on the die's level
            }));
            const { highlights } = analyseRoll(newDice.map(die => die.value));
            return { ...state, dice: newDice, rerollsLeft: state.rerollsLeft - 1, highlights };
        }

        case 'FINISH_ROLL': {
            const { base, multiplier, total, highlights } = analyseRoll(state.dice.map(die => die.value));

            // Check if it's the last round of the checkpoint
            const isLastRound = state.round === ROLLS_PER_CHECK;
            if (isLastRound) {
                const passedCheckpoint = state.points + total >= state.required;
                return {
                    ...state,
                    points: state.points + total,
                    gained: total,
                    base,
                    multiplier,
                    highlights,
                    shopAvailable: passedCheckpoint, // Enable shop if checkpoint is passed
                    gameOver: !passedCheckpoint, // End game if checkpoint is failed
                };
            }

            // Move to the next round
            const newDice = state.dice.map(die => ({
                ...die,
                value: roll([6, 8, 12, 20][die.level - 1]), // Roll based on the die's level
            }));
            const newHighlights = analyseRoll(newDice.map(die => die.value)).highlights;

            return {
                ...state,
                points: state.points + total,
                gained: total,
                base,
                multiplier,
                highlights: newHighlights,
                dice: newDice,
                rerollsLeft: 2,
                round: state.round + 1,
            };
        }

        case 'BUY_DIE': {
            if (!state.shopAvailable || state.points < state.buyCost) return state;
            return {
                ...state,
                points: state.points - state.buyCost,
                dice: [...state.dice, { value: roll(6), level: 1 }], // Add a new die with level 1
                buyCost: state.buyCost * 2,
            };
        }

        case 'UPGRADE_DIE': {
            if (state.points < state.upgradeCost) return state;

            // Define the sides for each level
            const levels = [6, 8, 10, 20];

            // Find a random die that can be upgraded
            const upgradableDice = state.dice.filter(die => die.level < levels.length);
            if (upgradableDice.length === 0) return state; // No dice to upgrade

            // Select a random die to upgrade
            const randomIndex = Math.floor(Math.random() * upgradableDice.length);
            const dieToUpgrade = upgradableDice[randomIndex];

            // Upgrade the die
            const upgradedDice = state.dice.map(die =>
                die === dieToUpgrade
                    ? { ...die, level: die.level + 1, value: roll(levels[die.level]) } // Increment level and roll new value
                    : die
            );

            return {
                ...state,
                points: state.points - state.upgradeCost,
                dice: upgradedDice,
                upgradeCost: state.upgradeCost * 2, // Double the cost for the next upgrade
            };
        }

        case 'NEXT_CHECKPOINT': {
            if (!state.shopAvailable) return state;

            const nextCheckpoint = state.checkpoint + 1;
            const newDice = state.dice.map(die => ({
                ...die,
                value: roll([6, 8, 12, 20][die.level - 1]), // Roll based on the die's level
            }));
            const newHighlights = analyseRoll(newDice.map(die => die.value)).highlights;
            return {
                ...state,
                checkpoint: nextCheckpoint,
                required: requiredForCheckpoint(nextCheckpoint),
                round: 1,
                rerollsLeft: 2,
                dice: newDice,
                highlights: newHighlights,
                gained: 0,
                base: 0,
                multiplier: 1,
                shopAvailable: false,
            };
        }

        case 'RESET': {
            return initialState();
        }

        default:
            return state;
    }
}