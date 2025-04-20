import { UpgradeRarity } from "@/constants/upgrades/upgradeRarity";

interface HUDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    rarity?: UpgradeRarity;
}

export default function HUDButton({ children, rarity, ...props }: HUDButtonProps) {
    // Define a gradient color palette from indigo to red
    const rarityColors = [
        'bg-indigo-600', // Common (rarity 1)
        'bg-purple-600', // Uncommon (rarity 2)
        'bg-pink-600',   // Rare (rarity 3)
        'bg-rose-600',   // Epic (rarity 4)
        'bg-red-600',    // Legendary (rarity 5)
    ];

    // Select the color based on the rarity
    const bgColor = rarity ? rarityColors[rarity.valueOf() - 1] : 'bg-indigo-600';

    return (
        <button
            className={`px-4 py-2 rounded-md text-white disabled:opacity-40 active:scale-95 transition-transform ${bgColor}`}
            {...props}
        >
            {children}
        </button>
    );
}