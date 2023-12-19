import { Puzzle } from './puzzle.model';
import { UserPuzzle } from './user-puzzles.model';

export interface Block {
    time: number; // in seconds (-1 for infinite)
    puzzlesCount: number; // 0 for infinite (until time is over)
    themes: string[];
    openingFamily?: string;
    eloStart: number;
    eloEnd: number;
    color: 'white' | 'black' | 'random';
    puzzleTime: number;
    puzzles?: Puzzle[];
    puzzlesPlayed?: UserPuzzle[];
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
