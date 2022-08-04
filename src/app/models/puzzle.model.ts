export interface Puzzle {
    uid: string;
    fen: string;
    moves: string;
    rating: number;
    ratingDeviation: number;
    popularity: number;
    nbPlays: number;
    themes: string[];
    gameUrl: string;
    openingFamily: string;
    openingVariation: string;
}
