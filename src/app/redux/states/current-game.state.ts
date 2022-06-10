import { createFeatureSelector } from '@ngrx/store';
import { Game } from '@models/game.model';

export enum StatusCurrentGame {
    loading = 'loading',
    playing = 'playing',
    error = 'error',
    creating = 'creating'
}

export interface CurrentGameState {
    game: Game | null;
    status: StatusCurrentGame;
    error: string;
}

export const getCurrentGameState = createFeatureSelector<CurrentGameState>('currentGameState');