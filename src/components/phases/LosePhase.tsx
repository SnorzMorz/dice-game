import { useState } from 'react';
import HUDButton from '../HUDButton';
import { ActionTypes } from '../../constants/actions';
import { GameState } from '../../models/GameState';
import { formatNumber } from '../../utils/formatNumber';

interface LosePhaseProps {
    state: GameState;
    dispatch: React.Dispatch<any>;
}

export default function LosePhase({ state, dispatch }: LosePhaseProps) {
    const [username, setUsername] = useState('');

    const saveScore = () => {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        leaderboard.push({ username, level: state.level });
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        dispatch({ type: ActionTypes.RESET });
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-red-400 text-xl font-semibold">
                Game Over! You needed {formatNumber(state.levelRequirement)} points but only had {formatNumber(state.points)}.
            </p>
            <input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-4 px-2 py-1 border rounded-md"
            />
            <div className='flex gap-3'>
                <HUDButton onClick={saveScore} disabled={!username.trim()}>
                    Save Score
                </HUDButton>
                <HUDButton onClick={() => dispatch({ type: ActionTypes.RESET })}>
                    Restart
                </HUDButton>
            </div>

        </div >
    );
}