import { GameState } from "@/models/GameState";
import { UpgradeRarity } from "@/constants/upgrades/upgradeRarity";

export class Upgrade {
    id: string;
    name: string;
    rarity: UpgradeRarity;
    apply: (state: GameState) => GameState;
    disabled: boolean;

    constructor(id: string, name: string, rarity: UpgradeRarity, apply: (state: GameState) => GameState, disabled: boolean = false) {
        this.id = id;
        this.name = name;
        this.rarity = rarity;
        this.disabled = disabled;
        this.apply = apply;
    }

    disable(): Upgrade {
        return new Upgrade(this.id, this.name, this.rarity, this.apply, true);

    }

}