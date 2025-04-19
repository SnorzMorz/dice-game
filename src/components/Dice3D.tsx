import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh } from 'three';

const FACE_LOOKUP: Record<number, Record<number, [number, number, number]>> = {
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
    3: {
        1: [0, 0, 0],
        2: [Math.PI / 5, 0, 0],
        3: [2 * Math.PI / 5, 0, 0],
        4: [3 * Math.PI / 5, 0, 0],
        5: [4 * Math.PI / 5, 0, 0],
        6: [Math.PI, 0, 0],
        7: [-4 * Math.PI / 5, 0, 0],
        8: [-3 * Math.PI / 5, 0, 0],
        9: [-2 * Math.PI / 5, 0, 0],
        10: [-Math.PI / 5, 0, 0],
    },
    4: {
        1: [0, 0, 0],
        2: [Math.PI / 10, 0, 0],
        3: [2 * Math.PI / 10, 0, 0],
        4: [3 * Math.PI / 10, 0, 0],
        5: [4 * Math.PI / 10, 0, 0],
        6: [5 * Math.PI / 10, 0, 0],
        7: [6 * Math.PI / 10, 0, 0],
        8: [7 * Math.PI / 10, 0, 0],
        9: [8 * Math.PI / 10, 0, 0],
        10: [9 * Math.PI / 10, 0, 0],
        11: [-9 * Math.PI / 10, 0, 0],
        12: [-8 * Math.PI / 10, 0, 0],
        13: [-7 * Math.PI / 10, 0, 0],
        14: [-6 * Math.PI / 10, 0, 0],
        15: [-5 * Math.PI / 10, 0, 0],
        16: [-4 * Math.PI / 10, 0, 0],
        17: [-3 * Math.PI / 10, 0, 0],
        18: [-2 * Math.PI / 10, 0, 0],
        19: [-Math.PI / 10, 0, 0],
        20: [0, 0, 0],
    },
};

interface Dice3DProps {
    value: number; // The rolled value of the die
    level: number; // The level of the die (1 = 6-sided, 2 = 8-sided, etc.)
    position: [number, number, number]; // The 3D position of the die
    colour?: string; // Optional highlight colour for the die
}

export default function Dice3D({ value, level, position, colour }: Dice3DProps) {
    const mesh = useRef<Mesh>(null);

    useFrame(() => {
        if (!mesh.current) return;
        const [rx, ry, rz] = FACE_LOOKUP[level][value];
        mesh.current.rotation.x += (rx - mesh.current.rotation.x) * 0.1;
        mesh.current.rotation.y += (ry - mesh.current.rotation.y) * 0.1;
        mesh.current.rotation.z += (rz - mesh.current.rotation.z) * 0.1;
    });
    return (
        <group position={position}>
            <mesh ref={mesh} castShadow>
                {level === 1 && <boxGeometry args={[1, 1, 1]} />} {/* 6-sided die */}
                {level === 2 && <octahedronGeometry args={[1]} />} {/* 8-sided die */}
                {level === 3 && <dodecahedronGeometry args={[1]} />} {/* 12-sided die */}
                {level === 4 && <icosahedronGeometry args={[1]} />} {/* 20-sided die */}
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