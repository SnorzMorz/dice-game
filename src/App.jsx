//////////////////////// src/App.jsx ////////////////////////
import { Suspense, useReducer } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import HUDButton from './components/HUDButton';
import Dice3D from './components/Dice3D';
import { initialState, reducer, ROLLS_PER_CHECK } from './GameEngine';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, initialState);
  const { dice, highlights, phase, rerollsLeft, points, round, checkpoint, gained, base, multiplier, required, buyCost } = state;

  const MAX_PER_ROW = 6;
  const xOffset = -((Math.min(dice.length, MAX_PER_ROW) - 1) * 1.8) / 2;
  const rows = [];
  for (let i = 0; i < dice.length; i += MAX_PER_ROW) rows.push(dice.slice(i, i + MAX_PER_ROW));

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <h1 className="text-3xl font-extrabold">Dice • 3D Prototype</h1>

      {phase !== 'LOSE' && (
        <p className="text-center">
          Checkpoint {checkpoint} • Round {round} / {ROLLS_PER_CHECK} • Points required {required}
          <br />Base {base} × {multiplier} = <span className="text-emerald-400">{gained}</span> • Total {points}
        </p>
      )}

      {!state.gameOver && (
        <>
          <Canvas shadows camera={{ position: [0, 4, 8], fov: 50 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
            <Suspense fallback={null}>
              {rows.map((row, rIdx) => {
                const zOff = -rIdx * 2;
                const xOffRow = -((row.length - 1) * 1.8) / 2;
                return row.map((d, j) => {
                  const idx = rIdx * MAX_PER_ROW + j;
                  return (
                    <Dice3D
                      key={`${rIdx}-${j}`}
                      value={d}
                      position={[xOffRow + j * 1.8, 0, zOff]}
                      colour={highlights[idx]}
                    />
                  );
                });
              })}
              <Environment preset="city" />
            </Suspense>
            <OrbitControls enablePan={false} enableZoom={false} />
          </Canvas>

          <div className="flex flex-col items-center gap-2">
            {state.round <= ROLLS_PER_CHECK && !state.shopAvailable && (
              <>
                <button className="underline" onClick={() => dispatch({ type: 'ROLL' })} disabled={state.rerollsLeft <= 0}>
                  {state.rerollsLeft > 0 ? `Reroll (${state.rerollsLeft})` : 'No rerolls'}
                </button>
                <HUDButton onClick={() => dispatch({ type: 'FINISH_ROLL' })}>Finish roll</HUDButton>
              </>
            )}

            {state.shopAvailable && (
              <>
                <HUDButton onClick={() => dispatch({ type: 'BUY_DIE' })} disabled={state.points < state.buyCost}>
                  Buy Die (cost {state.buyCost})
                </HUDButton>
                <HUDButton onClick={() => dispatch({ type: 'NEXT_CHECKPOINT' })}>Next checkpoint</HUDButton>
              </>
            )}
          </div>
        </>
      )}

      {state.gameOver && (
        <>
          <p className="text-red-400 text-xl font-semibold text-center">Game Over! You needed {state.required} points but only had {state.points}.</p>
          <HUDButton onClick={() => dispatch({ type: 'RESET' })}>Restart</HUDButton>
        </>
      )}

      {/* Rules / Help */}
      <details className="max-w-md text-sm opacity-80 mt-4">
        <summary className="cursor-pointer text-indigo-400">How to play</summary>
        <ul className="list-disc pl-6 space-y-1">
          <li>Start with 1 die. Each round you may <strong>reroll up to 2 times</strong>.</li>
          <li>Click <em>Finish roll</em> to lock in; scoring happens automatically.</li>
          <li><strong>Scoring</strong>: sum of faces × product of each duplicate group size.<br />Groups are colour‑coded.</li>
          <li>Buy extra dice in the shop; cost doubles each purchase.</li>
          <li>Every {ROLLS_PER_CHECK} rounds you must meet the checkpoint score or lose.</li>
        </ul>
      </details>
    </div>
  );
}