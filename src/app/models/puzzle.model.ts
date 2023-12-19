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
    times?: {
        warningOn: number;
        dangerOn: number;
        total: number;
    };
    timeUsed?: number;
    goshPuzzleTime?: number;
}

export interface PuzzleQueryOptions {
    rangeStart?: number;
    rangeEnd?: number;
    themes?: string[];
    openingFamily?: string;
    openingVariation?: string;
    color?: 'w' | 'b';
};
