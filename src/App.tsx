import { useState } from 'react';
import LeaderboardModal from './components/LeaderboardModal';
import HowToPlayModal from './components/HowToPlayModal'; // Import the new modal
import { useReducer } from 'react';
import { initialState, reducer } from './GameEngine';
import { Phases } from './constants/phases';
import RollPhase from './components/phases/RollPhase';
import ShopPhase from './components/phases/ShopPhase';
import LosePhase from './components/phases/LosePhase';
import GameCanvas from './components/GameCanvas';
import { formatNumber } from './utils/formatNumber';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, initialState);
  const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
  const [isHowToPlayOpen, setHowToPlayOpen] = useState(false); // State for "How to Play" modal

  const renderPhase = () => {
    switch (state.phase) {
      case Phases.ROLL:
        return <RollPhase state={state} dispatch={dispatch} />;
      case Phases.SHOP:
        return <ShopPhase state={state} dispatch={dispatch} />;
      case Phases.LOSE:
        return <LosePhase state={state} dispatch={dispatch} />;
      default:
        return null;
    }
  };

  const formatTotalBreakdown = () => {
    const groups = state.dice.reduce((acc, die) => {
      acc[die.value] = acc[die.value] || { count: 0, color: die.color };
      acc[die.value].count += 1;
      return acc;
    }, {} as Record<number, { count: number; color: string }>);

    // Sort groups by total value (value × count) in descending order
    const sortedGroups = Object.entries(groups).sort(
      ([valueA, { count: countA }], [valueB, { count: countB }]) =>
        Number(valueB) * countB - Number(valueA) * countA
    );

    return sortedGroups
      .map(([value, { count, color }]) => (
        <span key={value} style={{ color }}>
          {value} × {count}
        </span>
      ))
      .reduce((prev, curr) => [prev, " + ", curr] as any) as any; // Type assertion to avoid TS error
  };

  return (
    <div className="min-h-screen flex flex-col items-center gap-3 p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
      <h1 className="text-3xl font-extrabold">A game of Dice and Luck</h1>
      <div className="flex gap-4">
        <button
          className="text-indigo-400 underline hover:text-indigo-300"
          onClick={() => setLeaderboardOpen(true)}
        >
          View Leaderboard
        </button>
        <button
          className="text-indigo-400 underline hover:text-indigo-300"
          onClick={() => setHowToPlayOpen(true)}
        >
          How to Play
        </button>
      </div>
      <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setLeaderboardOpen(false)} />
      <HowToPlayModal isOpen={isHowToPlayOpen} onClose={() => setHowToPlayOpen(false)} />
      {/* Status Information */}
      <p className="text-center">
        Level {state.level} • Round {state.round} / {state.roundsPerLevel} • Points required {formatNumber(state.levelRequirement)}
        <br />
        {formatTotalBreakdown()}<span className="text-white"> = {formatNumber(state.gained)}</span>
        <br />
        Total Points: <span className="text-emerald-400">{formatNumber(state.points)}</span>
      </p>

      {/* Dice Display */}
      <GameCanvas state={state} dispatch={dispatch} />

      {/* Phase-Specific Content */}
      <div className="w-full flex justify-center">{renderPhase()}</div>
    </div>
  );
}