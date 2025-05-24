import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody } from '@react-three/rapier';
import { OrbitControls, Environment } from '@react-three/drei';
import Dice3D from './Dice3D';
import { GameState } from '../models/GameState';
import { ActionTypes } from '../constants/actions';
import { Upgrade } from '../models/Upgrade';


interface GameCanvasProps {
    state: GameState; // The current game state
    dispatch: React.Dispatch<{ type: ActionTypes; upgrade?: Upgrade }>;
}

export default function GameCanvas({ state, dispatch }: GameCanvasProps) {
    return (
        <div className="w-full h-[200px] md:h-[400px]">
            <Canvas shadows camera={{ position: [0, 6, 12], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
                <Physics gravity={[0, -9.81, 0]} debug={false}>
                    {/* static floor */}
                    <RigidBody type="fixed" restitution={0.6} friction={0.9}>
                        <mesh receiveShadow>
                            <boxGeometry args={[50, 1, 50]} />
                            <meshStandardMaterial color="#000" />
                        </mesh>
                    </RigidBody>

                    {/* the dice */}
                    {state.dice.map((d, i) => (
                        <Dice3D
                            key={i}
                            value={d.value}
                            level={d.level}
                            color={d.color}

                        />
                    ))}
                </Physics>
                <Environment preset="city" />
                <OrbitControls enablePan={false} enableZoom={true} />
            </Canvas>
        </div>
    );
}