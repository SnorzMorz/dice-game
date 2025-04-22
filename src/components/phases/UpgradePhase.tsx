import HUDButton from '../HUDButton';
import { Upgrade } from '../../models/Upgrade';
import { ActionTypes } from '../../constants/actions';
import { GameState } from '../../models/GameState';

interface UpgradePhaseProps {
    state: GameState;
    dispatch: React.Dispatch<any>;
}

export default function UpgradePhase({ state, dispatch }: UpgradePhaseProps) {
    const handleUpgradeSelection = (upgrade: Upgrade) => {
        dispatch({ type: ActionTypes.APPLY_UPGRADE, upgrade });
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">Choose a Global Upgrade</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {state.availableUpgrades?.map((upgrade) => (
                    <HUDButton key={upgrade.id} onClick={() => handleUpgradeSelection(upgrade)} rarity={upgrade.rarity}>
                        {upgrade.name}
                    </HUDButton>
                ))}
            </div>
        </div>
    );
}