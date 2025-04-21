import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Dice3D from './Dice3D';
import { GameState } from '../interfaces/GameState';
import { ActionTypes } from '../constants/actions';
import { Upgrade } from '../interfaces/Upgrade';

interface GameCanvasProps {
    state: GameState; // The current game state
    dispatch: React.Dispatch<{ type: ActionTypes; upgrade?: Upgrade }>;
}

export default function GameCanvas({ state, dispatch }: GameCanvasProps) {
    const MAX_PER_ROW = 6;
    const rows: GameState['dice'][] = [];
    for (let i = 0; i < state.dice.length; i += MAX_PER_ROW) {
        rows.push(state.dice.slice(i, i + MAX_PER_ROW));
    }

    return (
        <div className="w-full h-[200px] md:h-[400px]">
            <Canvas shadows camera={{ position: [0, 6, 12], fov: 50 }}>
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
                                color={d.color}
                            />
                        );
                    });
                })}
                <Environment preset="city" />
                <OrbitControls enablePan={false} enableZoom={true} />
            </Canvas>
        </div>
    );
}