export interface Puzzle {
    uid: string;
    fen: string;
    moves: string;
    rating: number;
    ratingDeviation: number;
    popularity: number;
    randomNumberQuery: number;
    nbPlays: number;
    themes: string[];
    gameUrl: string;
    openingFamily: string;
    openingVariation: string;
    infiniteSolveStatus?: 'solved' | 'wrong' | 'wrongTime';
}
