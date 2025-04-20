import { Upgrade } from "@/interfaces/Upgrade";

export function selectUpgrades(upgrades: Upgrade[], count: number = 3): Upgrade[] {
    const weightedUpgrades = upgrades.flatMap(upgrade =>
        Array(6 - upgrade.rarity).fill(upgrade)
    );

    const selected: Set<Upgrade> = new Set();
    while (selected.size < count) {
        const randomIndex = Math.floor(Math.random() * weightedUpgrades.length);
        const chosenUpgrade = weightedUpgrades[randomIndex];
        selected.add(chosenUpgrade);

    }

    return Array.from(selected);
}