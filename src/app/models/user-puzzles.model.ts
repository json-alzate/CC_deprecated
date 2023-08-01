export interface UserPuzzle {
    uid: string;
    uidUser: string;
    uidPuzzle: string;
    date: number;
    resolved: boolean;
    resolvedTime: number;
    currentEloUser: number;
    eloPuzzle: number;
    themes: string[];
    openingFamily?: string;
    openingVariation?: string;
}
