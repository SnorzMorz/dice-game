import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Dice3D from '../Dice3D';
import HUDButton from '../HUDButton';
import { ActionTypes } from '../../constants/actions';
import { GameState } from '../../models/GameState';
import { formatNumber } from '../../utils/formatNumber';

interface RollPhaseProps {
    state: GameState;
    dispatch: React.Dispatch<any>;
}

export default function RollPhase({ state, dispatch }: RollPhaseProps) {
    return (
        <>
            <div className="flex flex-col items-center gap-2">
                <button
                    className="underline"
                    onClick={() => dispatch({ type: ActionTypes.ROLL })}
                    disabled={state.rerollsLeft <= 0}
                >
                    {state.rerollsLeft > 0 ? `Reroll (${state.rerollsLeft})` : 'No rerolls'}
                </button>
                <HUDButton onClick={() => dispatch({ type: ActionTypes.FINISH_ROLL })}>Finish roll</HUDButton>
            </div>
        </>
    );
}