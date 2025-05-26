import { selectUpgrades } from './utils/selectUpgrades';
import { upgrades } from './constants/upgrades/upgrades';
import { GameState } from './models/GameState';
import { Upgrade } from './models/Upgrade';
import { ActionTypes } from './constants/actions';
import { Phases } from './constants/phases';
import { Die } from './models/Die';
import { calculateRollStats } from './utils/calculateRollStats';
import { updateDiceColors } from './utils/updateDiceColors';
import { DiceLevels } from './constants/diceLevels';

function requiredForNextLevel(previousLevelRequirement: number, multiplier: number): number {
    return Math.floor(previousLevelRequirement * multiplier);
}

export function initialState(): GameState {
    return {
        dice: [new Die()],
        phase: Phases.ROLL,
        points: 0,
        rerollsLeft: 2,
        maxRerolls: 2,
        level: 1,
        roundsPerLevel: 5,
        round: 1,
        levelRequirement: 10,
        gained: 0,
        base: 0,
        multiplier: 1,
        buyCost: 10,
        upgradeDiceCost: 10,
        levelMultiplier: 1.4,
        buyMultiplier: 2,
        upgradeDiceMultiplier: 1.5,
        maximumRoll: DiceLevels.LEVEL_5.valueOf(),
        minimumRoll: 1,
        availableUpgrades: [],
        upgradeCost: 100,
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
            const isLastRound = state.round === state.roundsPerLevel;
            if (isLastRound) {
                const { base, total } = calculateRollStats(state.dice);
                const passedLevel = state.points + total >= state.levelRequirement;
                return {
                    ...state,
                    points: state.points + total,
                    gained: total,
                    base: base,
                    rerollsLeft: state.maxRerolls,
                    phase: passedLevel ? Phases.SHOP : Phases.LOSE,
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
                points: state.points - state.upgradeDiceCost,
                upgradeDiceCost: Math.ceil(state.upgradeDiceCost * state.upgradeDiceMultiplier),
            };
        }

        case ActionTypes.BUY_GLOBAL_UPGRADE: {
            if (!action.upgrade || state.points < state.upgradeCost) return state;
            const newState = action.upgrade.apply(state);
            const updatedUpgrades = newState.availableUpgrades.map((u) =>
                u.id === action.upgrade?.id ? u.disable() : u
            );

            return {
                ...newState,
                points: newState.points - state.upgradeCost,
                availableUpgrades: updatedUpgrades,
                upgradeCost: Math.ceil(state.upgradeCost * 1.5),
            };
        }

        case ActionTypes.NEXT_LEVEL: {
            const nextLevel = state.level + 1;

            const shouldRefreshUpgrades = nextLevel % 5 === 0;
            const refreshedUpgrades = shouldRefreshUpgrades
                ? selectUpgrades(upgrades, 3)
                : state.availableUpgrades;

            const newDice = state.dice.map((die) => die.roll(state.minimumRoll, state.maximumRoll));
            const coloredDice = updateDiceColors(newDice);
            const { base, total } = calculateRollStats(coloredDice);

            return {
                ...state,
                level: nextLevel,
                levelRequirement: requiredForNextLevel(state.levelRequirement, state.levelMultiplier),
                round: 1,
                rerollsLeft: state.maxRerolls,
                dice: coloredDice,
                gained: total,
                base: 0,
                multiplier: 1,
                phase: Phases.ROLL,
                availableUpgrades: refreshedUpgrades,
            };
        }

        case ActionTypes.RESET: {
            return initialState();
        }

        default:
            return state;
    }
}