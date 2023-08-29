import { PiecesStyle, BoardStyle } from './ui.model';

export interface User {
    uid: string;
    name?: string;
    elo: number;
    eloPuzzles?: number;
    numberPuzzlesPlayed?: number;
    scoreCoordinatesW?: number;
    scoreCoordinatesB?: number;
    country?: string;
    createAt: number;
}
