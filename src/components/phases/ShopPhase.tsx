import HUDButton from '../HUDButton';
import { ActionTypes } from '../../constants/actions';
import { GameState } from '../../models/GameState';
import { formatNumber } from '@/utils/formatNumber';

interface ShopPhaseProps {
    state: GameState;
    dispatch: React.Dispatch<any>;
}

export default function ShopPhase({ state, dispatch }: ShopPhaseProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
                <HUDButton
                    onClick={() => dispatch({ type: ActionTypes.BUY_DIE })}
                    disabled={state.points < state.buyCost}
                >
                    Buy Die (cost {formatNumber(state.buyCost)})
                </HUDButton>
                <HUDButton
                    onClick={() => dispatch({ type: ActionTypes.UPGRADE_DIE })}
                    disabled={state.points < state.upgradeCost}
                >
                    Upgrade Random Die (cost {formatNumber(state.upgradeCost)})
                </HUDButton>
            </div>
            <HUDButton onClick={() => dispatch({ type: ActionTypes.NEXT_CHECKPOINT })}>Next checkpoint</HUDButton>
        </div>
    );
}