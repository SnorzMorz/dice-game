import { Suspense, useReducer } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import HUDButton from './components/HUDButton';
import Dice3D from './components/Dice3D';
import { phases, initialState, reducer } from './GameEngine';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, initialState);
  const { dice, highlights, phase, rerollsLeft, points, round, gained, base, multiplier, required } = state;

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <h1 className="text-3xl font-extrabold">Dice • 3D Prototype</h1>

      {phase !== phases.LOSE && (
        <p>
          Round {round} • Base {base} × {multiplier} = <span className="text-emerald-400">{gained}</span> • Total {points}
          • Next checkpoint {required + 100} pts
        </p>
      )}

      {phase === phases.LOSE && (
        <>
          <p className="text-red-400 text-xl font-semibold text-center">
            Game Over! You needed {required} points but only had {points}.
          </p>
          <HUDButton onClick={() => dispatch({ type: 'RESET' })}>Restart</HUDButton>
        </>
      )}

      {phase !== phases.LOSE && (
        <>
          <Canvas shadows camera={{ position: [0, 4, 8], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Suspense fallback={null}>
              {dice.map((d, i) => (
                <Dice3D
                  key={i}
                  value={d}
                  position={[i * 1.8 - 4, 0, 0]}
                  highlight={highlights.includes(i)}
                />
              ))}
              <Environment preset="city" />
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>

          {phase === phases.ROLL && (
            <div className="flex flex-col items-center gap-2">
              <HUDButton onClick={() => dispatch({ type: 'ROLL' })} disabled={rerollsLeft <= 0}>
                {rerollsLeft > 0 ? `Reroll (${rerollsLeft})` : 'No rerolls'}
              </HUDButton>
              <button className="underline" onClick={() => dispatch({ type: 'END_ROLL' })}>Finish roll</button>
            </div>
          )}

          {phase === phases.SCORE && (
            <HUDButton onClick={() => dispatch({ type: 'SCORE' })}>Score hand</HUDButton>
          )}

          {phase === phases.SHOP && (
            <HUDButton onClick={() => dispatch({ type: 'NEXT_ROUND' })}>Next round</HUDButton>
          )}
        </>
      )}
    </div>
  );
}