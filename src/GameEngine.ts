import { selectUpgrades } from './utils/selectUpgrades';
import { upgrades } from './constants/upgrades/upgrades';
import { GameState } from './models/GameState';
import { Upgrade } from './models/Upgrade';
import { DICE_COMBO_COLORS } from './constants/diceColors';
import { ActionTypes } from './constants/actions';
import { Phases } from './constants/phases';
import { Die } from './models/Die';

function requiredForNextCheckpoint(previousCheckPointRequirement: number, multiplier: number): number {
    return Math.floor(previousCheckPointRequirement * multiplier);
}

function calculateRollStats(dice: Die[]): {
    base: number;
    multiplier: number;
    total: number;
    groups: Record<number, Die[]>;
} {
    const base = dice.reduce((acc, die) => acc + die.value, 0);
    const freq: Record<number, Die[]> = {};
    dice.forEach((die) => (freq[die.value] ??= []).push(die));

    let multiplier = 1;
    Object.values(freq).forEach((diceGroup) => {
        if (diceGroup.length >= 2) {
            multiplier *= diceGroup.length;
        }
    });

    return { base, multiplier, total: base * multiplier, groups: freq };
}

function updateDiceColors(groups: Record<number, Die[]>): void {
    let colorIndex = 0;
    Object.values(groups).forEach((diceGroup) => {
        if (diceGroup.length >= 2) {
            const color = DICE_COMBO_COLORS[colorIndex % DICE_COMBO_COLORS.length];
            colorIndex += 1;
            diceGroup.forEach((die) => die.color = color);
        }
        else {
            diceGroup.forEach((die) => {
                die.resetColor();
            });
        }
    });
}

function analyseRoll(dice: Die[]): {
    base: number;
    multiplier: number;
    total: number;
} {
    const { base, multiplier, total, groups } = calculateRollStats(dice);
    updateDiceColors(groups);
    return { base, multiplier, total };
}

export function initialState(): GameState {
    return {
        dice: [new Die()],
        phase: Phases.ROLL,
        points: 0,
        rerollsLeft: 2,
        maxRerolls: 2,
        checkpoint: 1,
        roundsPerCheckpoint: 5,
        round: 1,
        checkpointRequirement: 10,
        gained: 0,
        base: 0,
        multiplier: 1,
        buyCost: 10,
        upgradeCost: 10,
        checkpointMultiplier: 1.4,
    };
}

export function reducer(state: GameState, action: { type: ActionTypes; upgrade?: Upgrade }): GameState {

    switch (action.type) {
        case ActionTypes.ROLL: {
            state.dice.forEach((die) => die.roll());
            analyseRoll(state.dice);
            return { ...state, rerollsLeft: state.rerollsLeft - 1 };
        }

        case ActionTypes.FINISH_ROLL: {
            const isLastRound = state.round === state.roundsPerCheckpoint;
            if (isLastRound) {
                const { base, multiplier, total } = analyseRoll(state.dice);
                const passedCheckpoint = state.points + total >= state.checkpointRequirement;
                return {
                    ...state,
                    points: state.points + total,
                    gained: total,
                    base,
                    multiplier,
                    rerollsLeft: state.maxRerolls,
                    phase: passedCheckpoint ? Phases.SHOP : Phases.LOSE,
                };
            }

            const newDice = state.dice.map((die) => {
                die.roll();
                return die;
            });
            const { base, multiplier, total } = analyseRoll(newDice);

            return {
                ...state,
                points: state.points + total,
                gained: total,
                base,
                multiplier,
                dice: newDice,
                rerollsLeft: state.maxRerolls,
                round: state.round + 1,
            };
        }

        case ActionTypes.BUY_DIE: {
            return {
                ...state,
                points: state.points - state.buyCost,
                dice: [...state.dice, new Die()],
                buyCost: Math.ceil(state.buyCost * 2),
            };
        }

        case ActionTypes.UPGRADE_DIE: {
            const upgradableDice = state.dice.filter((die) => die.canUpgrade());
            if (upgradableDice.length === 0) return state;

            const randomIndex = Math.floor(Math.random() * upgradableDice.length);
            const dieToUpgrade = upgradableDice[randomIndex];

            dieToUpgrade.upgradeLevel();

            console.log('Upgraded die:', dieToUpgrade);

            return {
                ...state,
                points: state.points - state.upgradeCost,
                upgradeCost: Math.ceil(state.upgradeCost * 1.5),
            };
        }

        case ActionTypes.APPLY_UPGRADE: {
            if (!action.upgrade) return state;
            const newState = action.upgrade.apply(state);
            return {
                ...newState,
                phase: Phases.ROLL,
                checkpoint: newState.checkpoint + 1,
                round: 1,
                availableUpgrades: [],
            };
        }

        case ActionTypes.NEXT_CHECKPOINT: {
            const nextCheckpoint = state.checkpoint + 1;

            if (nextCheckpoint % 5 === 0) {
                const availableUpgrades = selectUpgrades(upgrades, 3);
                return {
                    ...state,
                    checkpoint: nextCheckpoint,
                    phase: Phases.UPGRADE,
                    availableUpgrades: availableUpgrades,
                };
            }

            state.dice.forEach((die) => die.roll());
            analyseRoll(state.dice);

            return {
                ...state,
                checkpoint: nextCheckpoint,
                checkpointRequirement: requiredForNextCheckpoint(state.checkpointRequirement, 1.5),
                round: 1,
                rerollsLeft: state.maxRerolls,
                gained: 0,
                base: 0,
                multiplier: 1,
                phase: Phases.ROLL,
            };
        }

        case ActionTypes.RESET: {
            return initialState();
        }

        default:
            return state;
    }
}