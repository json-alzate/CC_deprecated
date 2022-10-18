import { CoordinatesPuzzlesGuard } from './coordinates-puzzles.guard';
import { PuzzlesGuard } from './puzzles.guard';
import { UserPuzzlesGuard } from './user-puzzles.guard';

export const guards: any[] = [
    CoordinatesPuzzlesGuard,
    PuzzlesGuard,
    UserPuzzlesGuard
];
