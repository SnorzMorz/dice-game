import { useState } from 'react';
import HUDButton from '../HUDButton';
import { ActionTypes } from '../../constants/actions';
import { GameState } from '../../models/GameState';
import { formatNumber } from '@/utils/formatNumber';

interface ShopPhaseProps {
    state: GameState;
    dispatch: React.Dispatch<any>;
}

export default function ShopPhase({ state, dispatch }: ShopPhaseProps) {
    const [floatingText, setFloatingText] = useState<string | null>(null);

    const handleBuyDice = () => {
        dispatch({ type: ActionTypes.BUY_DIE });
        showFloatingText('Bought 6-sided dice');
    };

    const handleUpgradeDice = () => {
        dispatch({ type: ActionTypes.UPGRADE_DIE });
        showFloatingText('Upgraded Dice');
    };

    const showFloatingText = (text: string) => {
        setFloatingText(text);
        setTimeout(() => setFloatingText(null), 2000); // Hide text after 2 seconds
    };

    return (
        <div className="flex flex-col items-center gap-2">
            {floatingText && (
                <div className="floating-text text-white">
                    {floatingText}
                </div>
            )}
            <div className="flex gap-2">
                <HUDButton
                    onClick={handleBuyDice}
                    disabled={state.points < state.buyCost}
                >
                    Buy Die (cost {formatNumber(state.buyCost)})
                </HUDButton>
                <HUDButton
                    onClick={handleUpgradeDice}
                    disabled={state.points < state.upgradeCost}
                >
                    Upgrade Random Die (cost {formatNumber(state.upgradeCost)})
                </HUDButton>
            </div>
            <HUDButton onClick={() => dispatch({ type: ActionTypes.NEXT_CHECKPOINT })}>
                Next checkpoint
            </HUDButton>
        </div>
    );
}