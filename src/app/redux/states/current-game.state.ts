import { Game } from '@models/game.model';

export interface CurrentGameState {
    game: Game | null;
    status: 'loading' | 'playing' | 'error' | null;
    error: string;
}