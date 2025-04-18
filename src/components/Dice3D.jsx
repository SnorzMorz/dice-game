import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

const FACE_LOOKUP = { 1: [0, 0, 0], 2: [Math.PI / 2, 0, 0], 3: [0, 0, -Math.PI / 2], 4: [0, 0, Math.PI / 2], 5: [-Math.PI / 2, 0, 0], 6: [Math.PI, 0, 0] };

export default function Dice3D({ value, position, colour }) {
    const mesh = useRef();
    useFrame(() => {
        const [rx, ry, rz] = FACE_LOOKUP[value] ?? [0, 0, 0];
        mesh.current.rotation.x += (rx - mesh.current.rotation.x) * 0.1;
        mesh.current.rotation.y += (ry - mesh.current.rotation.y) * 0.1;
        mesh.current.rotation.z += (rz - mesh.current.rotation.z) * 0.1;
    });
    return (
        <group position={position}>
            <mesh ref={mesh} castShadow>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={colour ?? 'white'} emissive={colour ?? '#000'} emissiveIntensity={colour ? 0.5 : 0} roughness={0.4} metalness={0.1} />
            </mesh>
            <Html center distanceFactor={8}>
                <span className="text-xl font-bold text-white drop-shadow-lg">{value}</span>
            </Html>
        </group>
    );
}