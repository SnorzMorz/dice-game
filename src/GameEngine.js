import { roll } from './utils/roll';

export const phases = {
    ROLL: 'ROLL',
    SCORE: 'SCORE',
    SHOP: 'SHOP',
    LOSE: 'LOSE',
};

const ROLLS_PER_CHECK = 5;           // every 5 rounds we check score
function requiredForRound(round) {   // 0‑based checkpoint
    return Math.floor(round / ROLLS_PER_CHECK) * 100; // 100, 200, …
}

// ────────────────────────────────────────────────────────────────
// Helper: analyse a roll and return base, multiplier, highlights
// ────────────────────────────────────────────────────────────────
function analyseRoll(dice) {
    const base = dice.reduce((a, b) => a + b, 0);
    // build frequency map {value: [indices]}
    const map = {};
    dice.forEach((v, i) => {
        map[v] ??= [];
        map[v].push(i);
    });
    // find the largest duplicate group (≥2)
    let maxGroup = [];
    Object.values(map).forEach(arr => {
        if (arr.length > maxGroup.length) maxGroup = arr;
    });
    const multiplier = Math.max(1, maxGroup.length);
    const total = base * multiplier;
    return { base, multiplier, total, highlights: maxGroup };
}

export function initialState() {
    const dice = Array(5).fill(null).map(() => roll());
    return {
        dice,
        highlights: [],
        phase: phases.ROLL,
        points: 0,
        rerollsLeft: 2,
        round: 1,
        gained: 0,
        base: 0,
        multiplier: 1,
        required: 0,
    };
}

export function reducer(state, action) {
    switch (action.type) {
        case 'ROLL':
            if (state.phase !== phases.ROLL || state.rerollsLeft <= 0) return state;
            return {
                ...state,
                dice: state.dice.map(() => roll()),
                rerollsLeft: state.rerollsLeft - 1,
                highlights: [],
            };

        case 'END_ROLL':
            if (state.phase !== phases.ROLL) return state;
            return { ...state, phase: phases.SCORE };

        case 'SCORE': {
            if (state.phase !== phases.SCORE) return state;
            const { base, multiplier, total, highlights } = analyseRoll(state.dice);
            return {
                ...state,
                points: state.points + total,
                gained: total,
                base,
                multiplier,
                highlights,
                phase: phases.SHOP,
            };
        }

        case 'NEXT_ROUND': {
            if (state.phase !== phases.SHOP) return state;
            const need = requiredForRound(state.round);
            if (state.round % ROLLS_PER_CHECK === 0 && state.points < need) {
                return { ...state, phase: phases.LOSE, required: need };
            }
            const nextRound = state.round + 1;
            return {
                ...state,
                dice: Array(5).fill(null).map(() => roll()),
                highlights: [],
                phase: phases.ROLL,
                round: nextRound,
                rerollsLeft: 2,
                gained: 0,
                base: 0,
                multiplier: 1,
                required: requiredForRound(nextRound - 1),
            };
        }

        case 'RESET':
            return initialState();

        default:
            return state;
    }
}