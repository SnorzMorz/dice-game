import { RigidBody, RapierRigidBody } from '@react-three/rapier';
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import { useCallback, useEffect, useRef } from 'react';
import { DiceLevels } from '@/constants/diceLevels';

const ROTATE_SMOOTH = 0.15;      // seconds to reach 63 % of the target

const FACE_LOOKUP: Record<DiceLevels, Record<number, [number, number, number]>> = {
    [DiceLevels.LEVEL_1]: {
        1: [0, 0, 0],
        2: [Math.PI / 2, 0, 0],
        3: [0, 0, -Math.PI / 2],
        4: [0, 0, Math.PI / 2],
        5: [-Math.PI / 2, 0, 0],
        6: [Math.PI, 0, 0],
    },
    [DiceLevels.LEVEL_2]: {
        1: [0, 0, 0],
        2: [Math.PI / 2, 0, 0],
        3: [0, Math.PI / 2, 0],
        4: [0, -Math.PI / 2, 0],
        5: [-Math.PI / 2, 0, 0],
        6: [Math.PI / 2, Math.PI, 0],
        7: [Math.PI, Math.PI / 2, 0],
        8: [Math.PI, 0, 0],
    },
    [DiceLevels.LEVEL_3]: {
        1: [0, 0, 0],
        2: [Math.PI / 6, 0, 0],
        3: [Math.PI / 3, 0, 0],
        4: [Math.PI / 2, 0, 0],
        5: [(2 * Math.PI) / 3, 0, 0],
        6: [(5 * Math.PI) / 6, 0, 0],
        7: [Math.PI, 0, 0],
        8: [-(5 * Math.PI) / 6, 0, 0],
        9: [-(2 * Math.PI) / 3, 0, 0],
        10: [-Math.PI / 2, 0, 0],
        11: [-Math.PI / 3, 0, 0],
        12: [-Math.PI / 6, 0, 0],
    },
    [DiceLevels.LEVEL_4]: {
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
    [DiceLevels.LEVEL_5]: {
        // 30 sided die (tetrahedron)
        1: [0, 0, 0],
        2: [Math.PI / 15, 0, 0],
        3: [2 * Math.PI / 15, 0, 0],
        4: [3 * Math.PI / 15, 0, 0],
        5: [4 * Math.PI / 15, 0, 0],
        6: [Math.PI / 3, 0, 0],
        7: [Math.PI / 2, 0, 0],
        8: [Math.PI, 0, 0],
        9: [-(Math.PI / 2), 0, 0],
        10: [-(Math.PI / 3), 0, 0],
        11: [-(4 * Math.PI) / 15, 0, 0],
        12: [-(3 * Math.PI) / 15, 0, 0],
        13: [-(2 * Math.PI) / 15, 0, 0],
        14: [-(Math.PI / 15), 0, 0],
        15: [0, 0, 0],
        16: [Math.PI / 15, 0, 0],
        17: [2 * Math.PI / 15, 0, 0],
        18: [3 * Math.PI / 15, 0, 0],
        19: [4 * Math.PI / 15, 0, 0],
        20: [Math.PI / 3, 0, 0],
        21: [Math.PI / 2, 0, 0],
        22: [Math.PI, 0, 0],
        23: [-(Math.PI / 2), 0, 0],
        24: [-(Math.PI / 3), 0, 0],
        25: [-(4 * Math.PI) / 15, 0, 0],
        26: [-(3 * Math.PI) / 15, 0, 0],
        27: [-(2 * Math.PI) / 15, 0, 0],
        28: [-(Math.PI / 15), 0, 0],
        29: [0, 0, 0],
        30: [Math.PI / 15, 0, 0],
    },
};


interface Dice3DProps {
    value: number; // The rolled value of the die
    level: DiceLevels; // The level of the die (1 = 6-sided, 2 = 8-sided, etc.)
    position: [number, number, number]; // The 3D position of the die
    color?: string; // Optional highlight colour for the die
}

const throwHeight = 4;   // metres
const throwImpulse = 8;   // N·s  (tune to taste)
const throwSpin = 25;  // rad s-¹

export default function Dice3D({
    value,
    level,
    color,
    onSettled,          // ← callback when the die falls asleep
}: Dice3DProps & { onSettled?: (v: number) => void }) {

    const body = useRef<RapierRigidBody>(null!);

    /** Convert rapier quaternion to the face pointing most closely up */
    const quaternionToValue = useCallback(
        (q: Quaternion): number => {
            const m = new Matrix4().makeRotationFromQuaternion(q);
            const up = new Vector3(0, 1, 0).applyMatrix4(m); // die’s local-up in world space

            let bestFace = 1;
            let bestDot = -Infinity;

            for (const [face, angles] of Object.entries(FACE_LOOKUP[level])) {
                const n = new Vector3(0, 1, 0).applyEuler(new Euler(...angles));
                const d = n.dot(up);
                if (d > bestDot) {
                    bestDot = d;
                    bestFace = +face;
                }
            }
            return bestFace;
        },
        [level],
    );

    /** Throw whenever `value` changes */
    useEffect(() => {
        if (!body.current) return;

        // Reset pose high above the table
        body.current.setTranslation({ x: 0, y: throwHeight, z: 0 }, true);
        body.current.setLinvel(
            {
                x: (Math.random() - 0.5) * throwImpulse,
                y: -throwImpulse * 0.5,
                z: (Math.random() - 0.5) * throwImpulse,
            },
            true,
        );
        body.current.setAngvel(
            {
                x: (Math.random() - 0.5) * throwSpin,
                y: (Math.random() - 0.5) * throwSpin,
                z: (Math.random() - 0.5) * throwSpin,
            },
            true,
        );
    }, [value]);

    /* Called automatically by Rapier when the body dozes off */
    const handleSleep = () => {
        const q = body.current.rotation();           // {x,y,z,w} in world space
        const face = quaternionToValue(
            new Quaternion(q.x, q.y, q.z, q.w),
        );
        onSettled?.(face);
    };

    return (
        <RigidBody
            ref={body}
            colliders="hull"          // convex hull works for d6/d8/d12/d20
            restitution={0.1}
            friction={0.6}
            onSleep={handleSleep}     // ← event supplied by react-three-rapier v2
        >
            <mesh castShadow>
                {level === DiceLevels.LEVEL_1 && <boxGeometry args={[1, 1, 1]} />}
                {level === DiceLevels.LEVEL_2 && <octahedronGeometry args={[1]} />}
                {level === DiceLevels.LEVEL_3 && <dodecahedronGeometry args={[1]} />}
                {level === DiceLevels.LEVEL_4 && <icosahedronGeometry args={[1]} />}

                {/* NOTE: Level 5 → 30-sided.  TetrahedronGeometry has only 4 faces.  
                 Import a rhombic-triacontahedron mesh or build one manually. */}

                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    roughness={0.4}
                    metalness={0.1}
                />
            </mesh>
        </RigidBody>
    );
}