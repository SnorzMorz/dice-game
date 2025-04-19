import { roll } from './utils/roll';
import { selectUpgrades } from './utils/selectUpgrades';
import { upgrades } from './utils/upgrades';
import { GameState } from './interfaces/GameState';
import { Upgrade } from './interfaces/Upgrade';
import { GROUP_COLOURS } from './constants/colors';
import { ROLLS_PER_CHECK, START_CHECKPOINT_POINTS, CHECK_GROWTH, INITIAL_BUY_COST } from './constants/game';

function requiredForCheckpoint(cp: number): number {
    return Math.ceil(START_CHECKPOINT_POINTS * Math.pow(CHECK_GROWTH, cp - 1));
}

function analyseRoll(dice: number[]): {
    base: number;
    multiplier: number;
    total: number;
    highlights: Record<number, string>;
} {
    const base = dice.reduce((a, b) => a + b, 0);
    const freq: Record<number, number[]> = {};
    dice.forEach((v, i) => (freq[v] ??= []).push(i));

    let multiplier = 1;
    const highlights: Record<number, string> = {};
    let colour = 0;

    Object.values(freq).forEach((idxArr) => {
        if (idxArr.length >= 2) {
            multiplier *= idxArr.length;
            const c = GROUP_COLOURS[colour % GROUP_COLOURS.length];
            colour += 1;
            idxArr.forEach((i) => (highlights[i] = c));
        }
    });

    return { base, multiplier, total: base * multiplier, highlights };
}

export function initialState(): GameState {
    const initialDice = [{ value: roll(6), level: 1 }]; // Each die starts at level 1 (6 sides)
    const { highlights } = analyseRoll(initialDice.map((die) => die.value));

    return {
        dice: initialDice,
        highlights,
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
        upgradeCost: 10,
    };
}

export function reducer(state: GameState, action: { type: string; upgrade?: Upgrade }): GameState {
    console.log('Action:', action); // Log the action
    console.log('State before:', state); // Log the state before the action

    switch (action.type) {
        case 'ROLL': {
            if (state.rerollsLeft <= 0) return state;
            const newDice = state.dice.map((die) => ({
                ...die,
                value: roll([6, 8, 12, 20][die.level - 1]),
            }));
            const { highlights } = analyseRoll(newDice.map((die) => die.value));
            return { ...state, dice: newDice, rerollsLeft: state.rerollsLeft - 1, highlights };
        }

        case 'FINISH_ROLL': {
            const { base, multiplier, total, highlights } = analyseRoll(state.dice.map((die) => die.value));

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
                    shopAvailable: passedCheckpoint,
                    gameOver: !passedCheckpoint,
                };
            }

            // Move to the next round
            const newDice = state.dice.map((die) => ({
                ...die,
                value: roll([6, 8, 12, 20][die.level - 1]),
            }));
            const newHighlights = analyseRoll(newDice.map((die) => die.value)).highlights;

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
                dice: [...state.dice, { value: roll(6), level: 1 }],
                buyCost: state.buyCost * 2,
            };
        }

        case 'UPGRADE_DIE': {
            if (state.points < state.upgradeCost) return state;

            const levels = [6, 8, 10, 20];

            const upgradableDice = state.dice.filter((die) => die.level < levels.length);
            if (upgradableDice.length === 0) return state;

            const randomIndex = Math.floor(Math.random() * upgradableDice.length);
            const dieToUpgrade = upgradableDice[randomIndex];

            const upgradedDice = state.dice.map((die) =>
                die === dieToUpgrade
                    ? { ...die, level: die.level + 1, value: roll(levels[die.level]) }
                    : die
            );

            return {
                ...state,
                points: state.points - state.upgradeCost,
                dice: upgradedDice,
                upgradeCost: state.upgradeCost * 2,
            };
        }

        case 'APPLY_UPGRADE': {
            if (!action.upgrade) return state;
            const newState = action.upgrade.apply(state);
            return {
                ...newState,
                phase: 'ROLL',
                availableUpgrades: [],
            };
        }

        case 'NEXT_CHECKPOINT': {
            if (!state.shopAvailable) return state;

            const nextCheckpoint = state.checkpoint + 1;

            if (nextCheckpoint % 5 === 0) {
                const selectedUpgrades = selectUpgrades(upgrades, 3);
                return {
                    ...state,
                    checkpoint: nextCheckpoint,
                    phase: 'UPGRADE_SELECTION',
                    availableUpgrades: selectedUpgrades,
                };
            }

            const newDice = state.dice.map((die) => ({
                ...die,
                value: roll([6, 8, 10, 20][die.level - 1]),
            }));
            const newHighlights = analyseRoll(newDice.map((die) => die.value)).highlights;

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