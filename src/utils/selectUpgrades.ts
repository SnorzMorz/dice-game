import { Upgrade } from "@/interfaces/Upgrade";

export function selectUpgrades(upgrades: Upgrade[], count: number = 3): Upgrade[] {
    const weightedUpgrades = upgrades.flatMap(upgrade =>
        Array(upgrade.rarity).fill(upgrade)
    );

    const selected: Upgrade[] = [];
    while (selected.length < count && weightedUpgrades.length > 0) {
        const randomIndex = Math.floor(Math.random() * weightedUpgrades.length);
        selected.push(weightedUpgrades.splice(randomIndex, 1)[0]);
    }

    return selected;
}