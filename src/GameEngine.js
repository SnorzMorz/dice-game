//////////////////////// src/GameEngine.js ////////////////////////
import { roll } from './utils/roll';

export const ROLLS_PER_CHECK = 5;
export const START_CHECKPOINT_POINTS = 20;
const CHECK_GROWTH = 1.6;
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
    return {
        dice: [roll()],
        highlights: {},
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
    };
}

export function reducer(state, action) {
    switch (action.type) {
        case 'ROLL': {
            if (state.rerollsLeft <= 0) return state;
            const newDice = state.dice.map(() => roll());
            const { highlights } = analyseRoll(newDice);
            return { ...state, dice: newDice, rerollsLeft: state.rerollsLeft - 1, highlights };
        }

        case 'FINISH_ROLL': {
            const { base, multiplier, total, highlights } = analyseRoll(state.dice);

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
            const newDice = state.dice.map(() => roll());
            return {
                ...state,
                points: state.points + total,
                gained: total,
                base,
                multiplier,
                highlights,
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
                dice: [...state.dice, roll()],
                buyCost: state.buyCost * 2,
            };
        }

        case 'NEXT_CHECKPOINT': {
            if (!state.shopAvailable) return state;

            const nextCheckpoint = state.checkpoint + 1;
            return {
                ...state,
                checkpoint: nextCheckpoint,
                required: requiredForCheckpoint(nextCheckpoint),
                round: 1,
                rerollsLeft: 2,
                dice: state.dice.map(() => roll()),
                highlights: {},
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