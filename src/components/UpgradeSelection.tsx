import HUDButton from './HUDButton';
import { Upgrade } from '@/interfaces/Upgrade';
import { GameState } from '@/interfaces/GameState';

interface UpgradeSelectionProps {
    upgrades: Upgrade[]; // List of available upgrades
    dispatch: React.Dispatch<{ type: string; upgrade?: Upgrade }>; // Dispatch function for state management
}

export default function UpgradeSelection({ upgrades, dispatch }: UpgradeSelectionProps) {
    const handleUpgradeSelection = (upgrade: Upgrade) => {
        dispatch({ type: 'APPLY_UPGRADE', upgrade });
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold">Choose a Global Upgrade</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upgrades.map((upgrade) => (
                    <HUDButton key={upgrade.id} onClick={() => handleUpgradeSelection(upgrade)}>
                        {upgrade.name}
                    </HUDButton>
                ))}
            </div>
        </div>
    );
}