//////////////////////// src/App.jsx ////////////////////////
import { Suspense, useReducer } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import HUDButton from './components/HUDButton';
import Dice3D from './components/Dice3D';
import { phases, initialState, reducer, ROLLS_PER_CHECK } from './GameEngine';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, initialState);
  const { dice, highlights, phase, rerollsLeft, points, round, checkpoint, gained, base, multiplier, required, buyCost } = state;

  const pointsNeeded = Math.max(0, required - points);
  const xOffset = -((dice.length - 1) * 1.8) / 2;

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <h1 className="text-3xl font-extrabold">A game of Dice and Luck</h1>

      {phase !== phases.LOSE && (
        <p className="text-center">
          Checkpoint {checkpoint} • Round {round} / {ROLLS_PER_CHECK} • Points needed {pointsNeeded}
          <br />Base {base} × {multiplier} = <span className="text-emerald-400">{gained}</span> • Total {points}
        </p>
      )}

      {phase === phases.LOSE && (
        <>
          <p className="text-red-400 text-xl font-semibold text-center">Game Over! You needed {required} points but only had {points}.</p>
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
                <Dice3D key={i} value={d} position={[xOffset + i * 1.8, 0, 0]} colour={highlights[i]} />
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

          {phase === phases.SHOP && (
            <div className="flex flex-col items-center gap-2">
              <HUDButton onClick={() => dispatch({ type: 'BUY_DIE' })} disabled={points < buyCost}>
                Buy Die (cost {buyCost})
              </HUDButton>
              <HUDButton onClick={() => dispatch({ type: 'NEXT_ROUND' })}>Next round</HUDButton>
            </div>
          )}

          {/* Rules / Help */}
          <details className="max-w-md text-sm opacity-80 mt-4" open>
            <summary className="cursor-pointer text-indigo-400">How to play</summary>
            <ul className="list-disc pl-6 space-y-1">
              <li>Start with 1 die. Each round you may <strong>reroll up to 2 times</strong>.</li>
              <li>Click <em>Finish roll</em> to lock in; scoring happens automatically.</li>
              <li><strong>Scoring</strong>: sum of faces × product of each duplicate group size.<br />Groups are colour‑coded.</li>
              <li>Buy extra dice in the shop; cost doubles each purchase.</li>
              <li>Every {ROLLS_PER_CHECK} rounds you must meet the checkpoint score or lose.</li>
            </ul>
          </details>
        </>
      )}
    </div>
  );
}