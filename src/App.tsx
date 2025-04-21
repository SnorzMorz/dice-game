import { useReducer } from 'react';
import { initialState, reducer } from './GameEngine';
import { Phases } from './constants/phases';
import RollPhase from './components/phases/RollPhase';
import UpgradePhase from './components/phases/UpgradePhase';
import ShopPhase from './components/phases/ShopPhase';
import LosePhase from './components/phases/LosePhase';
import GameCanvas from './components/GameCanvas';
import { formatNumber } from './utils/formatNumber';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, initialState);

  const renderPhase = () => {
    switch (state.phase) {
      case Phases.ROLL:
        return <RollPhase state={state} dispatch={dispatch} />;
      case Phases.UPGRADE:
        return <UpgradePhase state={state} dispatch={dispatch} />;
      case Phases.SHOP:
        return <ShopPhase state={state} dispatch={dispatch} />;
      case Phases.LOSE:
        return <LosePhase state={state} dispatch={dispatch} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-4 p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <h1 className="text-3xl font-extrabold">A game of Dice and Luck</h1>

      {/* Status Information */}
      <p className="text-center">
        Checkpoint {state.checkpoint} • Round {state.round} / {state.roundsPerCheckpoint} • Points required {formatNumber(state.checkpointRequirement)}
        <br />
        Base {formatNumber(state.base)} × {formatNumber(state.multiplier)} = <span className="text-emerald-400">{formatNumber(state.gained)}</span> • Total {formatNumber(state.points)}
      </p>

      {/* Dice Display */}
      <GameCanvas state={state} dispatch={dispatch} />

      {/* Phase-Specific Content */}
      <div className="w-full flex justify-center">{renderPhase()}</div>
    </div>
  );
}