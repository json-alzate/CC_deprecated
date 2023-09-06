import { Puzzle } from './puzzle.model';

export interface Block {
    time: number; // in seconds (-1 for infinite)
    puzzlesCount: number; // 0 for infinite (until time is over)
    themes: string[];
    openingFamily?: string;
    eloStart: number;
    eloEnd: number;
    puzzleTime: number;
    puzzles?: Puzzle[];
    showPuzzleSolution?: boolean;
    nextPuzzleImmediately?: boolean;
    goshPuzzle?: boolean;
    goshPuzzleTime?: number;
};

export interface Plan {
    uid: string;
    time: number; // in seconds (-1 for infinite)
    blocks: Block[];

};
