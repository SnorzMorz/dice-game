import { roll } from './utils/roll';
import { selectUpgrades } from './utils/selectUpgrades';
import { upgrades } from './constants/upgrades/upgrades';
import { GameState } from './interfaces/GameState';
import { Upgrade } from './interfaces/Upgrade';
import { DEFAULT_COLOR, DICE_COMBO_COLORS } from './constants/diceColors';
import { ActionTypes } from './constants/actions';
import { Phases } from './constants/phases';
import { Die } from './interfaces/Die';
import { DiceLevels } from './constants/diceLevels';

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
            diceGroup.forEach((die) => (die.color = color));
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
        dice: [{ value: roll(6), level: DiceLevels.LEVEL_1, color: DEFAULT_COLOR, multiplier: 1 }],
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
        upgradeCost: 5,
        checkpointMultiplier: 1.4,
    };
}

export function reducer(state: GameState, action: { type: ActionTypes; upgrade?: Upgrade }): GameState {
    console.log('Action:', action); // Log the action
    console.log('State before:', state); // Log the state before the action

    switch (action.type) {
        case ActionTypes.ROLL: {
            const newDice = state.dice.map((die) => ({
                ...die,
                value: roll(die.level.valueOf()),
            }));
            analyseRoll(newDice);
            return { ...state, dice: newDice, rerollsLeft: state.rerollsLeft - 1 };
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

            // Move to the next round
            const newDice = state.dice.map((die) => ({
                ...die,
                value: roll([6, 8, 12, 20][die.level - 1]),
            }));
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
                dice: [...state.dice, { value: roll(DiceLevels.LEVEL_1.valueOf()), level: DiceLevels.LEVEL_1, color: DEFAULT_COLOR, multiplier: 1 }],
                buyCost: state.buyCost * 2,
            };
        }

        case ActionTypes.UPGRADE_DIE: {
            const upgradableDice = state.dice.filter((die) => die.level.valueOf() < DiceLevels.LEVEL_4.valueOf());
            if (upgradableDice.length === 0) return state;

            const randomIndex = Math.floor(Math.random() * upgradableDice.length);
            const dieToUpgrade = upgradableDice[randomIndex];

            const upgradedDice = state.dice.map((die) =>
                die === dieToUpgrade
                    ? { ...die, level: die.level + 1, value: roll(die.level.valueOf()) }
                    : die
            );

            return {
                ...state,
                points: state.points - state.upgradeCost,
                dice: upgradedDice,
                upgradeCost: state.upgradeCost * 2,
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

            const newDice = state.dice.map((die) => ({
                ...die,
                value: roll([6, 8, 10, 20][die.level - 1]),
            }));
            analyseRoll(newDice);

            return {
                ...state,
                checkpoint: nextCheckpoint,
                checkpointRequirement: requiredForNextCheckpoint(state.checkpointRequirement, 1.5),
                round: 1,
                rerollsLeft: state.maxRerolls,
                dice: newDice,
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