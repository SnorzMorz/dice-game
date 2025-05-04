import { useState } from 'react';
import HUDButton from '../HUDButton';
import { ActionTypes } from '../../constants/actions';
import { GameState } from '../../models/GameState';
import { formatNumber } from '@/utils/formatNumber';
import { Upgrade } from '@/models/Upgrade';

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

    const handleBuyUpgrade = (upgrade: Upgrade) => {
        dispatch({ type: ActionTypes.BUY_GLOBAL_UPGRADE, upgrade });
        showFloatingText(`Bought Upgrade: ${upgrade.name}`);
    };

    const showFloatingText = (text: string) => {
        setFloatingText(text);
        setTimeout(() => setFloatingText(null), 2000);
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {floatingText && (
                <div className="floating-text text-white">
                    {floatingText}
                </div>
            )}
            <div className="flex gap-3">
                <HUDButton
                    onClick={handleBuyDice}
                    disabled={state.points < state.buyCost}
                >
                    Buy Die (cost {formatNumber(state.buyCost)})
                </HUDButton>
                <HUDButton
                    onClick={handleUpgradeDice}
                    disabled={state.points < state.upgradeDiceCost}
                >
                    Upgrade Random Die (cost {formatNumber(state.upgradeDiceCost)})
                </HUDButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {state.availableUpgrades?.map((upgrade) => (
                    <HUDButton
                        key={upgrade.id}
                        onClick={() => handleBuyUpgrade(upgrade)}
                        disabled={state.points < (state.upgradeCost * upgrade.rarity.valueOf()) || upgrade.disabled}
                        rarity={upgrade.rarity}
                    >
                        {upgrade.name} (cost {formatNumber(state.upgradeCost * upgrade.rarity.valueOf())})
                    </HUDButton>
                ))}
            </div>
            <HUDButton onClick={() => dispatch({ type: ActionTypes.NEXT_LEVEL })}>
                Next Level
            </HUDButton>
        </div>
    );
}