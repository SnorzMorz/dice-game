export interface Upgrade {
    id: string;
    name: string;
    rarity: number;
    apply: (state: any) => any; // Replace `any` with the actual state type when defined
}