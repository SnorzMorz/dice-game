import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const FACE_LOOKUP = {
    1: {
        1: [0, 0, 0],
        2: [Math.PI / 2, 0, 0],
        3: [0, 0, -Math.PI / 2],
        4: [0, 0, Math.PI / 2],
        5: [-Math.PI / 2, 0, 0],
        6: [Math.PI, 0, 0],
    },
    2: {
        1: [0, 0, 0],
        2: [Math.PI / 2, 0, 0],
        3: [0, Math.PI / 2, 0],
        4: [0, -Math.PI / 2, 0],
        5: [-Math.PI / 2, 0, 0],
        6: [Math.PI / 2, Math.PI, 0],
        7: [Math.PI, Math.PI / 2, 0],
        8: [Math.PI, 0, 0],
    },
};

export default function Dice3D({ value, level, position, colour }) {
    const mesh = useRef();
    useFrame(() => {
        const [rx, ry, rz] = FACE_LOOKUP[level][value] ?? [0, 0, 0];
        mesh.current.rotation.x += (rx - mesh.current.rotation.x) * 0.1;
        mesh.current.rotation.y += (ry - mesh.current.rotation.y) * 0.1;
        mesh.current.rotation.z += (rz - mesh.current.rotation.z) * 0.1;
    });
    return (
        <group position={position}>
            <mesh ref={mesh} castShadow>
                {level === 1 && <boxGeometry args={[1, 1, 1]} />} {/* 6-sided die */}
                {level === 2 && <octahedronGeometry args={[1]} />} {/* 8-sided die */}
                <meshStandardMaterial
                    color={colour ?? '#555'}
                    emissive={colour ?? '#000'}
                    emissiveIntensity={colour ? 0.5 : 0}
                    roughness={0.4}
                    metalness={0.1}
                />
            </mesh>
            <Html center distanceFactor={8}>
                <div>
                    <span className="text-xl font-bold text-white drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]">{value}</span>
                </div>
            </Html>
        </group>
    );
}