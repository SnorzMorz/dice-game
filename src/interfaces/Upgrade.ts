import { GameState } from "./GameState";
import { UpgradeRarity } from "@/constants/upgrades/upgradeRarity";
export interface Upgrade {
    id: string;
    name: string;
    rarity: UpgradeRarity;
    apply: (state: GameState) => GameState;
}