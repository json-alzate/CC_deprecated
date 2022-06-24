import { createFeatureSelector } from '@ngrx/store';
import { Game } from '@models/game.model';

export enum StatusCurrentGame {
    loading = 'loading',
    playing = 'playing',
    error = 'error',
    creating = 'creating',
    finished = 'finished'
}

export interface CurrentGameState {
    game: Game | null;
    status: StatusCurrentGame;
    error: string;
}

export const getCurrentGameState = createFeatureSelector<CurrentGameState>('currentGame');