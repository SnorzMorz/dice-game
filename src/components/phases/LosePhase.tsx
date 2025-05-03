import HUDButton from '../HUDButton';
import { ActionTypes } from '../../constants/actions';
import { GameState } from '../../models/GameState';
import { formatNumber } from '../../utils/formatNumber';

interface LosePhaseProps {
    state: GameState;
    dispatch: React.Dispatch<any>;
}

export default function LosePhase({ state, dispatch }: LosePhaseProps) {
    return (
        <div className="text-center">
            <p className="text-red-400 text-xl font-semibold">
                Game Over! You needed {formatNumber(state.levelRequirement)} points but only had {formatNumber(state.points)}.
            </p>
            <HUDButton onClick={() => dispatch({ type: ActionTypes.RESET })}>Restart</HUDButton>
        </div>
    );
}