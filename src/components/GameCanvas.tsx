import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Dice3D from './Dice3D';
import HUDButton from './HUDButton';
import { GameState } from '../interfaces/GameState';
import { ROLLS_PER_CHECK } from '../constants/game';

interface GameCanvasProps {
    state: GameState; // The current game state
    dispatch: React.Dispatch<{ type: string }>; // Dispatch function for state management
}

export default function GameCanvas({ state, dispatch }: GameCanvasProps) {
    const MAX_PER_ROW = 6;
    const rows: GameState['dice'][] = [];
    for (let i = 0; i < state.dice.length; i += MAX_PER_ROW) {
        rows.push(state.dice.slice(i, i + MAX_PER_ROW));
    }

    return (
        <>
            <p className="text-center">
                Checkpoint {state.checkpoint} • Round {state.round} / {ROLLS_PER_CHECK} • Points required {state.required}
                <br />Base {state.base} × {state.multiplier} = <span className="text-emerald-400">{state.gained}</span> • Total {state.points}
            </p>

            <Canvas shadows camera={{ position: [0, 4, 8], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
                {rows.map((row, rIdx) => {
                    const zOff = -rIdx * 2;
                    const xOffRow = -((row.length - 1) * 1.8) / 2;
                    return row.map((d, j) => {
                        const idx = rIdx * MAX_PER_ROW + j;
                        return (
                            <Dice3D
                                key={`${rIdx}-${j}`}
                                value={d.value}
                                level={d.level}
                                position={[xOffRow + j * 1.8, 0, zOff]}
                                colour={state.highlights[idx]}
                            />
                        );
                    });
                })}
                <Environment preset="city" />
                <OrbitControls enablePan={false} enableZoom={false} />
            </Canvas>

            <div className="flex flex-col items-center gap-2">
                {state.round <= ROLLS_PER_CHECK && !state.shopAvailable && (
                    <>
                        <button
                            className="underline"
                            onClick={() => dispatch({ type: 'ROLL' })}
                            disabled={state.rerollsLeft <= 0}
                        >
                            {state.rerollsLeft > 0 ? `Reroll (${state.rerollsLeft})` : 'No rerolls'}
                        </button>
                        <HUDButton onClick={() => dispatch({ type: 'FINISH_ROLL' })}>Finish roll</HUDButton>
                    </>
                )}

                {state.shopAvailable && (
                    <>
                        <div className="flex gap-2">
                            <HUDButton
                                onClick={() => dispatch({ type: 'BUY_DIE' })}
                                disabled={state.points < state.buyCost}
                            >
                                Buy Die (cost {state.buyCost})
                            </HUDButton>
                            <HUDButton
                                onClick={() => dispatch({ type: 'UPGRADE_DIE' })}
                                disabled={state.points < state.upgradeCost}
                            >
                                Upgrade Random Die (cost {state.upgradeCost})
                            </HUDButton>
                        </div>
                        <HUDButton onClick={() => dispatch({ type: 'NEXT_CHECKPOINT' })}>Next checkpoint</HUDButton>
                    </>
                )}
            </div>
        </>
    );
}