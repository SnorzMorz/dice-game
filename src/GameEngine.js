//////////////////////// src/GameEngine.js ////////////////////////
import { roll } from './utils/roll';

export const phases = { ROLL: 'ROLL', SHOP: 'SHOP', LOSE: 'LOSE', END_ROLL: 'END_ROLL' };
export const ROLLS_PER_CHECK = 5;

export const START_CHECKPOINT_POINTS = 20;   // points needed for checkpoint 1
const CHECK_GROWTH = 1.75;                    // 75 % tougher each checkpoint
const INITIAL_BUY_COST = 10;

// duplicate‑group colours
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
        phase: phases.ROLL,
        points: 0,
        rerollsLeft: 2,
        // checkpoint / round bookkeeping
        checkpoint: 1,
        round: 1,                 // 1 → 5 inside checkpoint
        required: requiredForCheckpoint(1),
        // last‑hand info
        gained: 0,
        base: 0,
        multiplier: 1,
        // shop
        buyCost: INITIAL_BUY_COST,
    };
}

export function reducer(state, action) {
    switch (action.type) {
        // --- Roll phase ---------------------------------------------------
        case phases.ROLL:
            if (state.phase !== phases.ROLL || state.rerollsLeft <= 0) return state;
            return { ...state, dice: state.dice.map(() => roll()), rerollsLeft: state.rerollsLeft - 1, highlights: {} };

        case phases.END_ROLL: {
            if (state.phase !== phases.ROLL) return state;
            const { base, multiplier, total, highlights } = analyseRoll(state.dice);
            return { ...state, points: state.points + total, gained: total, base, multiplier, highlights, phase: phases.SHOP };
        }

        // --- Shop actions -------------------------------------------------
        case 'BUY_DIE':
            if (state.phase !== phases.SHOP || state.points < state.buyCost) return state;
            return { ...state, points: state.points - state.buyCost, dice: [...state.dice, roll()], buyCost: state.buyCost * 2 };

        case 'NEXT_ROUND': {
            if (state.phase !== phases.SHOP) return state;

            // if we just finished round 5, evaluate checkpoint success
            if (state.round === ROLLS_PER_CHECK) {
                if (state.points < state.required) {
                    return { ...state, phase: phases.LOSE };
                }
                // advance to next checkpoint
                const newCheckpoint = state.checkpoint + 1;
                return {
                    ...state,
                    checkpoint: newCheckpoint,
                    required: requiredForCheckpoint(newCheckpoint),
                    round: 1,
                    phase: phases.ROLL,
                    rerollsLeft: 2,
                    dice: state.dice.map(() => roll()),
                    highlights: {},
                    gained: 0,
                    base: 0,
                    multiplier: 1,
                };
            }

            // otherwise just next round within checkpoint
            return {
                ...state,
                round: state.round + 1,
                phase: phases.ROLL,
                rerollsLeft: 2,
                dice: state.dice.map(() => roll()),
                highlights: {},
                gained: 0,
                base: 0,
                multiplier: 1,
            };
        }

        // --- Reset --------------------------------------------------------
        case 'RESET':
            return initialState();

        default:
            return state;
    }
}