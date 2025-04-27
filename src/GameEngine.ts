import { selectUpgrades } from './utils/selectUpgrades';
import { upgrades } from './constants/upgrades/upgrades';
import { GameState } from './models/GameState';
import { Upgrade } from './models/Upgrade';
import { DICE_COMBO_COLORS } from './constants/diceColors';
import { ActionTypes } from './constants/actions';
import { Phases } from './constants/phases';
import { Die } from './models/Die';
import { calculateRollStats } from './utils/calculateRollStats';
import { updateDiceColors } from './utils/updateDiceColors';
import { DiceLevels } from './constants/diceLevels';

function requiredForNextCheckpoint(previousCheckPointRequirement: number, multiplier: number): number {
    return Math.floor(previousCheckPointRequirement * multiplier);
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
        buyMultiplier: 2,
        upgradeMultiplier: 1.5,
        maximumRoll: DiceLevels.LEVEL_5.valueOf(),
        minimumRoll: 1,
    };
}

export function reducer(state: GameState, action: { type: ActionTypes; upgrade?: Upgrade }): GameState {

    switch (action.type) {
        case ActionTypes.ROLL: {
            const newDice = state.dice.map((die) => die.roll(state.minimumRoll, state.maximumRoll));
            const coloredDice = updateDiceColors(newDice);
            const { base, total } = calculateRollStats(coloredDice);

            return {
                ...state,
                dice: coloredDice,
                rerollsLeft: state.rerollsLeft - 1,
                base: base,
                gained: total,
            };
        }

        case ActionTypes.FINISH_ROLL: {
            const isLastRound = state.round === state.roundsPerCheckpoint;
            if (isLastRound) {
                const { base, total } = calculateRollStats(state.dice);
                const passedCheckpoint = state.points + total >= state.checkpointRequirement;
                return {
                    ...state,
                    points: state.points + total,
                    gained: total,
                    base: base,
                    rerollsLeft: state.maxRerolls,
                    phase: passedCheckpoint ? Phases.SHOP : Phases.LOSE,
                };
            }

            const newDice = state.dice.map((die) => die.roll(state.minimumRoll, state.maximumRoll));
            const coloredDice = updateDiceColors(newDice);
            const { base, total } = calculateRollStats(coloredDice);

            return {
                ...state,
                points: state.points + total,
                gained: total,
                base,
                dice: coloredDice,
                rerollsLeft: state.maxRerolls,
                round: state.round + 1,
            };
        }

        case ActionTypes.BUY_DIE: {
            return {
                ...state,
                points: state.points - state.buyCost,
                dice: [...state.dice, new Die()],
                buyCost: Math.ceil(state.buyCost * state.buyMultiplier),
            };
        }

        case ActionTypes.UPGRADE_DIE: {
            const upgradableDice = state.dice.filter((die) => die.canUpgrade());
            if (upgradableDice.length === 0) return state;

            const randomIndex = Math.floor(Math.random() * upgradableDice.length);
            const dieToUpgrade = upgradableDice[randomIndex];

            // Replace the upgraded die with a new instance
            const newDice = state.dice.map((die) =>
                die === dieToUpgrade ? die.upgradeLevel() : die
            );

            return {
                ...state,
                dice: newDice,
                points: state.points - state.upgradeCost,
                upgradeCost: Math.ceil(state.upgradeCost * state.upgradeMultiplier),
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

            const newDice = state.dice.map((die) => die.roll(state.minimumRoll, state.maximumRoll));
            const coloredDice = updateDiceColors(newDice);
            const { base, total } = calculateRollStats(coloredDice);

            return {
                ...state,
                checkpoint: nextCheckpoint,
                checkpointRequirement: requiredForNextCheckpoint(state.checkpointRequirement, state.checkpointMultiplier),
                round: 1,
                rerollsLeft: state.maxRerolls,
                dice: coloredDice,
                gained: total,
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