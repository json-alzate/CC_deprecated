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
    elos?: {
        warmup?: {
            [key: string]: number;
        };
        plan5?: {
            [key: string]: number;
        };
        plan5Openings?: {
            [key: string]: number;
        };
        plan10?: {
            [key: string]: number;
        };
        plan10Openings?: {
            [key: string]: number;
        };
        plan20?: {
            [key: string]: number;
        };
        plan20Openings?: {
            [key: string]: number;
        };
        plan30?: {
            [key: string]: number;
        };
        plan30Openings?: {
            [key: string]: number;
        };
        backToCalm?: {
            [key: string]: number;
        };

    };
    createAt: number;
}
