import { GameState } from "@/models/GameState";
import { UpgradeRarity } from "@/constants/upgrades/upgradeRarity";

export class Upgrade {
    id: string;
    name: string;
    rarity: UpgradeRarity;
    apply: (state: GameState) => GameState;

    constructor(id: string, name: string, rarity: UpgradeRarity, apply: (state: GameState) => GameState) {
        this.id = id;
        this.name = name;
        this.rarity = rarity;
        this.apply = apply;
    }
}