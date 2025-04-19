import { useReducer } from 'react';
import { initialState, reducer } from '../GameEngine';
import { GameState } from '../interfaces/GameState';

export function useGameReducer(): [GameState, React.Dispatch<any>] {
    return useReducer(reducer, null, initialState);
}